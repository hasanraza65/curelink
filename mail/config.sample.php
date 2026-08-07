<?php
/**
 * SMTP configuration — SAMPLE.
 *
 * Copy this file to `config.php` and fill in the real password. `config.php`
 * is the only file that ever holds the credential; keep it out of version
 * control and off any public URL (the .htaccess in this folder blocks direct
 * web access to the whole directory except send.php).
 *
 *   cp mail/config.sample.php mail/config.php
 */

return [
    // --- Namecheap cPanel SMTP -------------------------------------------
    // cPanel mail hosts accept implicit TLS on 465, or STARTTLS on 587.
    'host'       => 'mail.privateemail.com',
    'port'       => 465,
    'encryption' => 'ssl',          // 'ssl' for port 465, 'tls' for port 587
    // Namecheap shared cPanel presents a *.web-hosting.com certificate on
    // mail.<yourdomain>. The chain is still verified; this is only the name we
    // expect to find on it. Remove this line if the host ever gets a matching
    // certificate, and see the note at the bottom about running on-server.
    'username'   => 'info@curelinkpharma.net',
    'password'   => 'PUT-THE-MAILBOX-PASSWORD-HERE',
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
