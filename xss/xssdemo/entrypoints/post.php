<?php
$msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $msg = $_POST['message'] ?? '';
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Post</title>
  <link rel="stylesheet" href="/assets/style.css"/>
</head>
<body>
  <div class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <div class="brand-badge">XSS</div>
        <div>Post</div>
      </div>
      <div class="nav">
        <a class="pill" href="/index.html">← Back to index</a>
      </div>
    </div>
  </div>
  <div class="wrapper">
    <div class="hero">
      <h1>Post</h1></div>
    <div class="card">
      <form method="post"><input name="message"><button>Send</button></form>
  <?php if ($msg !== ''): ?>
    <p>Your message: <?php echo $msg; ?></p> <!-- vulnerable -->
  <?php endif; ?>
    </div>
    <div class="footer">cyber-course</div>
  </div>
</body>
</html>