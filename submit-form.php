<?php
// Hardened PHP mail handler
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success'=>false,'message'=>'Method not allowed']);
  exit;
}

// Simple sanitization helpers
function clean($v){
  $v = trim($v ?? '');
  $v = str_replace(["\r","\n"], ' ', $v); // prevent header injection
  return htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$honeypot = clean($_POST['website'] ?? '');
if ($honeypot !== '') {
  echo json_encode(['success'=>true,'message'=>'OK']); // Silently succeed for bots
  exit;
}

$name       = clean($_POST['name'] ?? '');
$email      = clean($_POST['email'] ?? '');
$phone      = clean($_POST['phone'] ?? '');
$location   = clean($_POST['location'] ?? '');
$eventDate  = clean($_POST['eventDate'] ?? '');
$duration   = clean($_POST['duration'] ?? '');
$attendees  = clean($_POST['attendees'] ?? '');
$package    = clean($_POST['package'] ?? '');
$messageRaw = trim($_POST['message'] ?? '');
$menuSelRaw = trim($_POST['menuSelections'] ?? '');

// Basic validation
$errors = [];
if ($name === '') $errors[] = 'Name required';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email required';
if ($phone === '') $errors[] = 'Phone required';
if ($location === '') $errors[] = 'Location required';
if ($eventDate === '') $errors[] = 'Event date required';
if ($duration === '' || !is_numeric($duration)) $errors[] = 'Duration required';
if ($attendees === '' || !is_numeric($attendees)) $errors[] = 'Attendees required';
if ($package === '') $errors[] = 'Package required';

if ($errors) {
  http_response_code(422);
  echo json_encode(['success'=>false,'message'=>'Validation failed','errors'=>$errors]);
  exit;
}

$messageSafe = htmlspecialchars($messageRaw, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$menuSafe    = htmlspecialchars($menuSelRaw, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

// $to = 'lastrata25@gmail.com';
$to = 'pishkyle@gmail.com';
$subject = 'New Event Inquiry from ' . $name;

$body = "NEW EVENT INQUIRY\n\n" .
        "Name: $name\n" .
        "Email: $email\n" .
        "Phone: $phone\n" .
        "Event Location: $location\n" .
        "Event Date: $eventDate\n" .
        "Duration: $duration hours\n" .
        "Number of Attendees: $attendees\n" .
        "Package: $package\n";
if ($menuSafe !== '') {
  $body .= "\n" . html_entity_decode($menuSafe, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "\n";
}
if ($messageSafe !== '') {
  $body .= "\nAdditional Notes:\n" . html_entity_decode($messageSafe, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "\n";
}

// Use a domain-safe From to avoid SPF/DMARC rejection; keep user email in Reply-To
$domainFrom = 'no-reply@lastratamobilecharcuteriebar.com';
$headers = 'From: La Strata Inquiry <' . $domainFrom . ">\r\n" .
           'Reply-To: ' . $email . "\r\n" .
           'X-Mailer: PHP/' . phpversion() . "\r\n" .
           'Content-Type: text/plain; charset=UTF-8';

// Simple logging setup
$logLine = date('c') . " | $name | $email | $package | attendees:$attendees | duration:$duration | sent:"; 

$sent = @mail($to, $subject, $body, $headers);
if ($sent) {
  // Append success to log
  @file_put_contents(__DIR__ . '/submission.log', $logLine . "YES\n", FILE_APPEND);
  echo json_encode(['success'=>true,'message'=>'Email sent']);
} else {
  // Backup payload to JSONL for manual review
  $backup = [
    'ts'=>date('c'),
    'name'=>$name,
    'email'=>$email,
    'phone'=>$phone,
    'location'=>$location,
    'eventDate'=>$eventDate,
    'duration'=>$duration,
    'attendees'=>$attendees,
    'package'=>$package,
    'menuSelections'=>$menuSelRaw,
    'message'=>$messageRaw
  ];
  @file_put_contents(__DIR__ . '/submission_backup.jsonl', json_encode($backup) . "\n", FILE_APPEND);
  @file_put_contents(__DIR__ . '/submission.log', $logLine . "NO\n", FILE_APPEND);
  http_response_code(500);
  echo json_encode(['success'=>false,'message'=>'Mail send failed','hint'=>'Server mail() may be disabled; check submission.log and backup file.']);
}
