<?php
/**
 * A small SMTP client.
 *
 * Written against the socket rather than PHP's mail() because mail() on shared
 * cPanel hosting sends as the web-server user, which fails SPF and DMARC for
 * the domain and lands the message in spam. Authenticating as the real mailbox
 * over SMTP is what makes the mail deliverable.
 *
 * No Composer, no PHPMailer — one file, PHP 7.4+, needs only openssl.
 */

declare(strict_types=1);

final class SmtpException extends RuntimeException
{
}

final class Smtp
{
    /** @var resource|null */
    private $socket = null;

    private array $log = [];
    private array $cfg;

    public function __construct(array $cfg)
    {
        $this->cfg = $cfg + [
            'host' => '', 'port' => 465, 'encryption' => 'ssl',
            'username' => '', 'password' => '', 'timeout' => 20,
        ];
    }

    public function getLog(): array
    {
        return $this->log;
    }

    /**
     * @param array{email:string,name?:string}        $from
     * @param string[]                                $to
     * @param string[]                                $bcc
     * @param array{email:string,name?:string}|null   $replyTo
     */
    public function send(
        array $from,
        array $to,
        string $subject,
        string $textBody,
        string $htmlBody = '',
        array $bcc = [],
        ?array $replyTo = null
    ): void {
        $recipients = array_values(array_unique(array_merge($to, $bcc)));
        if ($recipients === []) {
            throw new SmtpException('No recipients given.');
        }

        $this->connect();

        try {
            $this->authenticate();

            $this->command('MAIL FROM:<' . $from['email'] . '>', [250]);
            foreach ($recipients as $rcpt) {
                $this->command('RCPT TO:<' . $rcpt . '>', [250, 251]);
            }
            $this->command('DATA', [354]);

            $data = $this->buildMessage($from, $to, $subject, $textBody, $htmlBody, $replyTo);
            // dot-stuffing: a line that is just "." would otherwise end the DATA block
            $data = preg_replace('/^\./m', '..', $data);

            $this->write($data . "\r\n.\r\n");
            $this->expect([250]);

            $this->command('QUIT', [221]);
        } finally {
            $this->close();
        }
    }

    /* ------------------------------------------------------------ transport */

    private function connect(): void
    {
        $scheme = $this->cfg['encryption'] === 'ssl' ? 'ssl://' : 'tcp://';
        $target = $scheme . $this->cfg['host'] . ':' . $this->cfg['port'];

        /*
         * The certificate chain is always verified. What is configurable is the
         * NAME we expect on it.
         *
         * Namecheap shared cPanel serves mail.<yourdomain> from a shared box
         * whose certificate is issued for *.web-hosting.com, so a strict
         * hostname match fails even though the certificate is a perfectly valid
         * Sectigo one. Setting `peer_name` to the name the server genuinely
         * presents keeps full chain validation — a forged certificate is still
         * rejected — while accepting that documented mismatch.
         */
        $ssl = [
            'verify_peer'       => true,
            'verify_peer_name'  => true,
            'allow_self_signed' => false,
            'SNI_enabled'       => true,
        ];
        if (!empty($this->cfg['peer_name'])) {
            $ssl['peer_name'] = $this->cfg['peer_name'];
        }

        $context = stream_context_create(['ssl' => $ssl]);

        $errno = 0;
        $errstr = '';
        $socket = @stream_socket_client(
            $target,
            $errno,
            $errstr,
            (int) $this->cfg['timeout'],
            STREAM_CLIENT_CONNECT,
            $context
        );

        if (!$socket) {
            throw new SmtpException(sprintf('Could not connect to %s (%d: %s)', $target, $errno, $errstr));
        }

        $this->socket = $socket;
        stream_set_timeout($this->socket, (int) $this->cfg['timeout']);

        $this->expect([220]);

        $hello = $this->cfg['host'];
        $this->command('EHLO ' . $hello, [250]);

        if ($this->cfg['encryption'] === 'tls') {
            $this->command('STARTTLS', [220]);
            $ok = @stream_socket_enable_crypto(
                $this->socket,
                true,
                STREAM_CRYPTO_METHOD_TLS_CLIENT
            );
            if (!$ok) {
                throw new SmtpException('STARTTLS negotiation failed.');
            }
            // the capability list must be requested again inside the TLS session
            $this->command('EHLO ' . $hello, [250]);
        }
    }

    private function authenticate(): void
    {
        // AUTH LOGIN is what cPanel/Exim advertises; PLAIN is the fallback.
        $this->command('AUTH LOGIN', [334]);
        $this->command(base64_encode((string) $this->cfg['username']), [334]);
        $this->command(base64_encode((string) $this->cfg['password']), [235]);
    }

    private function close(): void
    {
        if (is_resource($this->socket)) {
            @fclose($this->socket);
        }
        $this->socket = null;
    }

    /* -------------------------------------------------------------- plumbing */

    private function write(string $data): void
    {
        if (!is_resource($this->socket)) {
            throw new SmtpException('Socket is closed.');
        }
        if (@fwrite($this->socket, $data) === false) {
            throw new SmtpException('Failed writing to the SMTP socket.');
        }
    }

    private function command(string $cmd, array $expected): string
    {
        // never let a password reach the log
        $this->log[] = '> ' . (preg_match('/^[A-Za-z0-9+\/=]{8,}$/', $cmd) ? '[credential]' : $cmd);
        $this->write($cmd . "\r\n");
        return $this->expect($expected);
    }

    private function expect(array $codes): string
    {
        $response = '';
        while (is_resource($this->socket) && !feof($this->socket)) {
            $line = fgets($this->socket, 1024);
            if ($line === false) {
                $meta = stream_get_meta_data($this->socket);
                throw new SmtpException($meta['timed_out'] ? 'SMTP read timed out.' : 'SMTP connection lost.');
            }
            $response .= $line;
            // a multi-line reply has a '-' as the 4th char; the last line has a space
            if (strlen($line) >= 4 && $line[3] === ' ') {
                break;
            }
        }

        $this->log[] = '< ' . trim($response);
        $code = (int) substr($response, 0, 3);
        if (!in_array($code, $codes, true)) {
            throw new SmtpException('Unexpected SMTP reply: ' . trim($response));
        }
        return $response;
    }

    /* --------------------------------------------------------------- message */

    /** RFC 2047 encoding, so non-ASCII in a header does not corrupt the mail. */
    public static function encodeHeader(string $value): string
    {
        if (preg_match('/^[\x20-\x7E]*$/', $value)) {
            return $value;
        }
        return '=?UTF-8?B?' . base64_encode($value) . '?=';
    }

    private static function address(array $a): string
    {
        $email = $a['email'];
        $name = trim((string) ($a['name'] ?? ''));
        return $name === '' ? $email : sprintf('%s <%s>', self::encodeHeader($name), $email);
    }

    private function buildMessage(
        array $from,
        array $to,
        string $subject,
        string $text,
        string $html,
        ?array $replyTo
    ): string {
        $boundary = 'b' . bin2hex(random_bytes(12));
        $domain = substr(strrchr($from['email'], '@') ?: '@localhost', 1);

        $headers = [
            'Date: ' . date('r'),
            'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . $domain . '>',
            'From: ' . self::address($from),
            'To: ' . implode(', ', $to),
            'Subject: ' . self::encodeHeader($subject),
            'MIME-Version: 1.0',
        ];

        if ($replyTo !== null && $replyTo['email'] !== '') {
            $headers[] = 'Reply-To: ' . self::address($replyTo);
        }

        if ($html === '') {
            $headers[] = 'Content-Type: text/plain; charset=UTF-8';
            $headers[] = 'Content-Transfer-Encoding: 8bit';
            $body = $this->normalise($text);
        } else {
            $headers[] = 'Content-Type: multipart/alternative; boundary="' . $boundary . '"';
            $body = implode("\r\n", [
                '--' . $boundary,
                'Content-Type: text/plain; charset=UTF-8',
                'Content-Transfer-Encoding: 8bit',
                '',
                $this->normalise($text),
                '',
                '--' . $boundary,
                'Content-Type: text/html; charset=UTF-8',
                'Content-Transfer-Encoding: 8bit',
                '',
                $this->normalise($html),
                '',
                '--' . $boundary . '--',
            ]);
        }

        return implode("\r\n", $headers) . "\r\n\r\n" . $body;
    }

    /** SMTP requires CRLF line endings throughout. */
    private function normalise(string $s): string
    {
        return preg_replace("/\r\n|\r|\n/", "\r\n", $s);
    }
}
