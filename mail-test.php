<?php
// Simple mail test script.
$to = 'lastrata25@gmail.com'; // change if needed
$subject = 'Mail Function Test ' . date('c');
$body = "Testing PHP mail() from server at " . $_SERVER['SERVER_NAME'] . " (" . date('r') . ")\n";
$headers = 'From: Mail Tester <no-reply@lastratamobilecharcuteriebar.com>' . "\r\n" .
           'Reply-To: no-reply@lastratamobilecharcuteriebar.com' . "\r\n" .
           'X-Mailer: PHP/' . phpversion() . "\r\n" .
           'Content-Type: text/plain; charset=UTF-8';

$sent = @mail($to, $subject, $body, $headers);
header('Content-Type: text/plain');
if($sent){
  echo "SUCCESS: Test mail accepted by mail()\n";
} else {
  echo "FAILURE: mail() returned false.\n";
  echo "Possible causes: disabled mail() (no sendmail), SPF/DMARC rejection, or host restrictions.\n";
}
?>
