<?php
/**
 * api_feed.php
 *
 * Same-origin API endpoint for a DOM-XSS demo.
 *
 * It returns JSON that contains an ARRAY of objects.
 *
 * The array is loaded from a local file: feed.json
 *
 * Why is this interesting for DOM-XSS?
 * - Many frontends trust API responses (same-domain)
 * - But the content might come from:
 *     - a file on the server
 *     - a CMS
 *     - a log pipeline
 *     - a database entry that an attacker can influence
 *
 * This endpoint intentionally does NOT sanitize output.
 */

header("Content-Type: application/json");

$file = __DIR__ . "/feed.json";

// If file does not exist, return empty array
if (!file_exists($file)) {
  echo "[]";
  exit;
}

// Return the file as-is (intentionally insecure)
echo file_get_contents($file);
