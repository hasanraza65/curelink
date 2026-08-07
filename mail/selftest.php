<?php
/**
 * Mailer self-test.
 *
 * Run from the command line on the server:   php mail/selftest.php
 * Or, temporarily, in a browser:             /mail/selftest.php?key=<secret>
 *
 * It checks the four things that actually break in practice, in order, and
 * tells you which one failed instead of just "could not send":
 *
 *   1. config.php exists and is readable
 *   2. the SMTP port is reachable at all
 *   3. TLS completes and the certificate is accepted
 *   4. the mailbox credentials are accepted, and a real message goes out
 *
 * DELETE THIS FILE, or at least change $BROWSER_KEY, once the form is live.
 */

declare(strict_types=1);

$BROWSER_KEY = 'curelink-selftest';

$cli = PHP_SAPI === 'cli';
if (!$cli) {
    header('Content-Type: text/plain; charset=utf-8');
    if (($_GET['key'] ?? '') !== $BROWSER_KEY) {
        http_response_code(403);
        exit("Forbidden.\n");
    }
}

$nl = "\n";
function step(string $label): void { printf('%-46s', $label . ' ... '); }
function pass(string $extra = ''): void { echo 'OK' . ($extra !== '' ? "  ($extra)" : '') . "\n"; }
function fail(string $why): void { echo "FAILED\n\n  → " . $why . "\n"; exit(1); }

echo "Curelink mailer self-test" . $nl . str_repeat('=', 46) . $nl . $nl;

/* 1 ---------------------------------------------------------------- config */
step('1. config.php present');
$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    fail("mail/config.php not found.\n    Copy mail/config.sample.php to mail/config.php and set the password.");
}
$cfg = require $configPath;
foreach (['host', 'port', 'username', 'password', 'from_email', 'to'] as $k) {
    if (empty($cfg[$k])) fail("config.php is missing a value for '$k'.");
}
if (strpos((string) $cfg['password'], 'PUT-THE-MAILBOX') !== false) {
    fail('config.php still contains the placeholder password.');
}
pass($cfg['username']);

/* 2 ------------------------------------------------------------ reachable */
step('2. SMTP port reachable');
$plain = ($cfg['encryption'] === 'ssl' ? 'ssl://' : 'tcp://') . $cfg['host'] . ':' . $cfg['port'];
$ctx = stream_context_create(['ssl' => ['verify_peer' => false, 'verify_peer_name' => false]]);
$probe = @stream_socket_client($plain, $e, $s, 12, STREAM_CLIENT_CONNECT, $ctx);
if (!$probe) {
    fail("Cannot reach {$cfg['host']}:{$cfg['port']} — $s\n"
       . "    The host may block outbound SMTP. If this site runs on the same\n"
       . "    cPanel account, try host 'localhost', port 25, encryption 'none'.");
}
$banner = trim((string) fgets($probe, 512));
fclose($probe);
pass(substr($banner, 0, 40));

/* 3 ------------------------------------------------------------------ TLS */
step('3. TLS certificate accepted');
$ssl = ['verify_peer' => true, 'verify_peer_name' => true];
if (!empty($cfg['peer_name'])) $ssl['peer_name'] = $cfg['peer_name'];
$tls = @stream_socket_client($plain, $e2, $s2, 12, STREAM_CLIENT_CONNECT, stream_context_create(['ssl' => $ssl]));
if (!$tls && $cfg['encryption'] === 'ssl') {
    fail("TLS verification failed — $s2\n"
       . "    On Namecheap shared hosting the certificate is issued for\n"
       . "    *.web-hosting.com, so config.php needs:  'peer_name' => '*.web-hosting.com'");
}
if ($tls) fclose($tls);
pass(!empty($cfg['peer_name']) ? 'peer_name ' . $cfg['peer_name'] : 'strict');

/* 4 ----------------------------------------------------------------- send */
step('4. Authenticate and send');
require __DIR__ . '/Smtp.php';
$smtp = new Smtp($cfg);
try {
    $when = date('D, d M Y H:i:s');
    $smtp->send(
        ['email' => $cfg['from_email'], 'name' => $cfg['from_name'] ?? ''],
        (array) $cfg['to'],
        'Curelink mailer self-test',
        "The Curelink website mailer is configured correctly.\n\nSent: $when\n",
        '<div style="font:400 15px/1.6 Arial,sans-serif;color:#101e2a">'
        . '<h2 style="color:#0a5b96;margin:0 0 10px">Mailer self-test passed</h2>'
        . '<p>The Curelink website mailer is configured correctly.</p>'
        . '<p style="color:#6c8091;font-size:13px">Sent: ' . htmlspecialchars($when) . '</p></div>',
        (array) ($cfg['bcc'] ?? [])
    );
} catch (Throwable $ex) {
    $msg = $ex->getMessage();
    $hint = '';
    if (strpos($msg, '535') !== false) {
        $hint = "\n    535 means the server rejected the username or password.\n"
              . "    • Confirm the mailbox exists in cPanel → Email Accounts\n"
              . "    • Confirm the password, or reset it there\n"
              . "    • Use the full address as the username: {$cfg['username']}";
    } elseif (strpos($msg, '550') !== false) {
        $hint = "\n    550 usually means the From address is not a mailbox on this server.";
    }
    fail($msg . $hint . "\n\n  SMTP conversation:\n    " . implode("\n    ", $smtp->getLog()));
}
pass();

echo $nl . 'All checks passed. A test message was sent to: '
   . implode(', ', (array) $cfg['to']) . $nl
   . 'Remember to delete mail/selftest.php before launch.' . $nl;
