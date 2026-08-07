<?php
/**
 * SMTP configuration — LIVE.
 *
 * This is the only file that holds the mailbox password. Keep it out of version
 * control and off any public URL; the .htaccess in this folder blocks direct
 * web access to everything here except send.php.
 */

return [
    // --- Namecheap cPanel SMTP -------------------------------------------
    // Mail for curelinkpharma.net is on Namecheap PRIVATE EMAIL, not on the
    // cPanel server — the domain's MX records point at mx*-hosting.jellyfish
    // .systems. Authenticating against mail.<domain> reaches the cPanel Exim
    // server instead, which has no such mailbox and answers 535. Private Email
    // presents a valid certificate, so no peer_name override is needed here.
    'host'       => 'mail.privateemail.com',
    'port'       => 465,
    'encryption' => 'ssl',          // 'ssl' for port 465, 'tls' for port 587
    'username'   => 'info@curelinkpharma.net',
    'password'   => 'information2026!!!',
    'timeout'    => 20,

    // --- Envelope ---------------------------------------------------------
    // The From address must be a mailbox on this domain or the server will
    // reject it. Anything else fails SPF/DMARC even if the server accepts it.
    'from_email' => 'info@curelinkpharma.net',
    'from_name'  => 'Curelink Pharmaceuticals',

    // Where enquiries land. Add more addresses to send to several inboxes.
    'to'         => ['ranahasanraza24@gmail.com'],

    // Copy of every enquiry kept in the company mailbox. Leave empty to skip.
    'bcc'        => [],

    // --- Behaviour --------------------------------------------------------
    // Minimum seconds between submissions from one IP address.
    'throttle_seconds' => 20,

    // Set true only while debugging: returns the SMTP conversation in the
    // JSON response. Never leave this on in production.
    'debug' => false,
];

/*
 * Running on the cPanel server itself?
 * Once this site is live on the same hosting account, the simplest and fastest
 * configuration is the local mail server — no TLS negotiation, no DNS lookup:
 *
 *     'host' => 'localhost', 'port' => 25, 'encryption' => 'none',
 *
 * Authentication is still required, and the peer_name line above becomes
 * irrelevant. Test it after deploying with: php mail/selftest.php
 */
