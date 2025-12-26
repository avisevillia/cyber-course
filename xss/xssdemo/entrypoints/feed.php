<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Feed</title>
  <link rel="stylesheet" href="/assets/style.css"/>
</head>
<body>
  <div class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <div class="brand-badge">XSS</div>
        <div>Feed</div>
      </div>
      <div class="nav">
        <a class="pill" href="/index.html">← Back to index</a>
      </div>
    </div>
  </div>
  <div class="wrapper">
    <div class="hero">
      <h1>Feed</h1></div>
    <div class="card">
      <h1>Third-party Feed — PHP Fetch Version</h1>

<?php
// URL of your local feed (can be localhost:8001 or remote)
$feedUrl = 'http://localhost:8001/feed.json';

// Fetch feed server-side (use curl for better control)
$ch = curl_init($feedUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 10,
]);
$json = curl_exec($ch);
if ($json === false) {
    echo "<p style='color:red'>Error fetching feed: " . htmlspecialchars(curl_error($ch)) . "</p>";
}
curl_close($ch);

// Decode JSON
$data = json_decode($json, true);
if (!$data) {
    echo "<p style='color:red'>Invalid JSON or empty feed.</p>";
    exit;
}
$items = $data['items'] ?? [];
?>

<div class="vuln">
  <h2>Vulnerable rendering (raw HTML output)</h2>
  <?php foreach ($items as $it): ?>
    <div class="item">
      <h3><?= $it['title'] ?? '' ?></h3>
      <p><?= $it['summary'] ?? '' ?></p>
      <!-- ❌ VULNERABLE: echoing attacker-controlled HTML directly -->
      <div><?= $it['content_html'] ?? '' ?></div>
      <a href="<?= htmlspecialchars($it['url'] ?? '') ?>">link</a>
    </div>
  <?php endforeach; ?>
</div>
    </div>
    <div class="footer">cyber-course</div>
  </div>
</body>
</html>