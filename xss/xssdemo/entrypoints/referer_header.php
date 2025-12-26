<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Referer Header</title>
  <link rel="stylesheet" href="/assets/style.css"/>
</head>
<body>
  <div class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <div class="brand-badge">XSS</div>
        <div>Referer Header</div>
      </div>
      <div class="nav">
        <a class="pill" href="/index.html">← Back to index</a>
      </div>
    </div>
  </div>
  <div class="wrapper">
    <div class="hero">
      <h1>Referer Header</h1></div>
    <div class="card">
      <h1>Victim page</h1>
  <p>This page prints the Referer header (INTENTIONALLY VULNERABLE).</p>

  <div style="padding:12px;border:1px solid #ccc;">
    <strong>Referer Header:</strong>
    <?php
      // VULNERABLE: echoing user-agent without escaping for demo only
      echo rawurldecode($_SERVER['HTTP_REFERER']);
    ?>
  </div>
    </div>
    <div class="footer">cyber-course</div>
  </div>
</body>
</html>