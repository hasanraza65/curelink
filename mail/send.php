<?php
/**
 * Form endpoint for the whole site.
 *
 * Every form on Curelink posts here — the homepage contact block, the contact
 * page, and the per-product enquiry dialog. They differ only by which fields
 * they send, so one handler covers all three.
 *
 * Returns JSON: {"ok":true,"message":"…"} or {"ok":false,"error":"…"}.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

require __DIR__ . '/Smtp.php';

/* ------------------------------------------------------------------ helpers */

function respond(bool $ok, string $message, int $status = 200, array $extra = []): void
{
    http_response_code($status);
    echo json_encode(
        array_merge($ok ? ['ok' => true, 'message' => $message] : ['ok' => false, 'error' => $message], $extra),
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
    exit;
}

/** Trim, collapse runaway whitespace and cap the length of a submitted value. */
function field(string $key, int $max = 500): string
{
    $raw = $_POST[$key] ?? '';
    if (!is_string($raw)) {
        return '';
    }
    $v = trim($raw);
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '';
    return mb_substr($v, 0, $max);
}

/**
 * Header injection guard. A newline in a value that reaches a mail header lets
 * an attacker append their own headers and use the form as an open relay, so
 * anything with a line break in it is rejected outright rather than sanitised.
 */
function hasHeaderInjection(string $v): bool
{
    return (bool) preg_match('/[\r\n]/', $v);
}

function clientIp(): string
{
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'] as $k) {
        if (!empty($_SERVER[$k])) {
            $ip = trim(explode(',', (string) $_SERVER[$k])[0]);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    return '0.0.0.0';
}

/* -------------------------------------------------------------------- setup */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(false, 'Method not allowed.', 405);
}

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    error_log('Curelink mail: mail/config.php is missing. Copy config.sample.php and add the password.');
    respond(false, 'The contact form is not configured yet. Please email us directly.', 500);
}
$cfg = require $configPath;

/* ------------------------------------------------------------ anti-spam */

// Honeypot: a field hidden from people but filled in by naive bots. Answer with
// success so the bot has no signal to adapt to.
if (field('company_website') !== '') {
    respond(true, 'Thank you — your message has been sent.');
}

// Submitting faster than a person could realistically type is a bot.
$elapsed = (int) (field('form_time') ?: 0);
if ($elapsed > 0 && (time() - $elapsed) < 3) {
    respond(true, 'Thank you — your message has been sent.');
}


/* ------------------------------------------------------------- validation */

$name    = field('name', 120);
$email   = field('email', 160);
$phone   = field('phone', 60);
$subject = field('subject', 120);
$product = field('product', 160);
$variant = field('variant', 80);
$message = field('message', 4000);

$errors = [];

if ($name === '') {
    $errors[] = 'a name';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'a valid email address';
}
if ($message === '') {
    $errors[] = 'a message';
}

if ($errors !== []) {
    respond(false, 'Please provide ' . implode(', ', $errors) . '.', 422);
}

foreach ([$name, $email, $phone, $subject, $product, $variant] as $v) {
    if (hasHeaderInjection($v)) {
        respond(false, 'That submission could not be processed.', 400);
    }
}

/*
 * Per-IP throttle, so one source cannot flood the mailbox.
 *
 * Deliberately checked AFTER validation: a visitor who mistypes their email and
 * corrects it is resubmitting within seconds, and should not be told to wait.
 * Only a submission that would otherwise have been sent counts against them.
 */
$throttle = (int) ($cfg['throttle_seconds'] ?? 20);
if ($throttle > 0) {
    $stampFile = sys_get_temp_dir() . '/curelink-form-' . sha1(clientIp()) . '.txt';
    $last = is_file($stampFile) ? (int) @file_get_contents($stampFile) : 0;
    if ($last && (time() - $last) < $throttle) {
        respond(false, 'You have just sent a message. Please wait a moment before sending another.', 429);
    }
    @file_put_contents($stampFile, (string) time());
}

/* ---------------------------------------------------------------- compose */

$isProduct = $product !== '';
$mailSubject = $isProduct
    ? sprintf('Product enquiry: %s', $product)
    : sprintf('Website enquiry: %s', $subject !== '' ? $subject : 'General');

$rows = [];
if ($isProduct) {
    $rows['Product'] = $product;
}
if ($variant !== '') {
    $rows['Variant'] = $variant;
}
$rows['Name / company'] = $name;
$rows['Email']          = $email;
$rows['Phone']          = $phone !== '' ? $phone : '—';
if ($subject !== '') {
    $rows['Enquiry type'] = $subject;
}
$rows['Received'] = date('D, d M Y H:i') . ' (server time)';
$rows['Source']   = field('page_url', 300) ?: 'Website';

$text = "New enquiry from the Curelink website\n"
      . str_repeat('=', 40) . "\n\n";
foreach ($rows as $k => $v) {
    $text .= str_pad($k . ':', 18) . $v . "\n";
}
$text .= "\nMessage:\n" . str_repeat('-', 40) . "\n" . $message . "\n";

$e = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');

$rowsHtml = '';
foreach ($rows as $k => $v) {
    $rowsHtml .= '<tr>'
        . '<td style="padding:9px 14px;background:#f4f8fb;border-bottom:1px solid #e4ecf2;'
        . 'font:600 13px/1.4 Arial,Helvetica,sans-serif;color:#506474;white-space:nowrap;">' . $e((string) $k) . '</td>'
        . '<td style="padding:9px 14px;border-bottom:1px solid #e4ecf2;'
        . 'font:400 14px/1.5 Arial,Helvetica,sans-serif;color:#101e2a;">' . $e((string) $v) . '</td>'
        . '</tr>';
}

$html = '<!doctype html><html><body style="margin:0;padding:24px;background:#eef3f7;">'
    . '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:620px;margin:0 auto;'
    . 'background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #dce6ed;">'
    . '<tr><td style="padding:20px 24px;background:#0a5b96;">'
    . '<div style="font:700 17px/1.3 Arial,Helvetica,sans-serif;color:#ffffff;">'
    . ($isProduct ? 'New product enquiry' : 'New website enquiry') . '</div>'
    . '<div style="font:400 13px/1.4 Arial,Helvetica,sans-serif;color:#bcd9ef;margin-top:3px;">'
    . 'Curelink Pharmaceuticals</div></td></tr>'
    . '<tr><td style="padding:22px 24px 8px;">'
    . '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" '
    . 'style="border:1px solid #e4ecf2;border-radius:8px;border-collapse:separate;overflow:hidden;">'
    . $rowsHtml . '</table></td></tr>'
    . '<tr><td style="padding:8px 24px 24px;">'
    . '<div style="font:600 13px/1.4 Arial,Helvetica,sans-serif;color:#506474;margin:14px 0 8px;">Message</div>'
    . '<div style="padding:14px 16px;background:#f4f8fb;border-left:3px solid #00a651;border-radius:0 8px 8px 0;'
    . 'font:400 14px/1.65 Arial,Helvetica,sans-serif;color:#25333e;white-space:pre-wrap;">'
    . $e($message) . '</div>'
    . '<div style="margin-top:18px;font:400 12px/1.5 Arial,Helvetica,sans-serif;color:#6c8091;">'
    . 'Reply directly to this email to answer ' . $e($name) . '.</div>'
    . '</td></tr></table></body></html>';

/* -------------------------------------------------------------------- send */

try {
    $smtp = new Smtp($cfg);
    $smtp->send(
        ['email' => $cfg['from_email'], 'name' => $cfg['from_name']],
        (array) $cfg['to'],
        $mailSubject,
        $text,
        $html,
        (array) ($cfg['bcc'] ?? []),
        // replying to the notification answers the customer, not ourselves
        ['email' => $email, 'name' => $name]
    );
} catch (Throwable $ex) {
    error_log('Curelink mail failed: ' . $ex->getMessage());
    respond(
        false,
        'We could not send your message right now. Please email us at ' . $cfg['from_email'] . '.',
        502,
        !empty($cfg['debug']) ? ['debug' => $ex->getMessage(), 'log' => $smtp->getLog()] : []
    );
}

respond(true, 'Thank you — your message has been sent. We will get back to you shortly.');
