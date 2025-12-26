<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Useragent Header</title>
  <link rel="stylesheet" href="/assets/style.css"/>
</head>
<body>
  <div class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <div class="brand-badge">XSS</div>
        <div>Useragent Header</div>
      </div>
      <div class="nav">
        <a class="pill" href="/index.html">← Back to index</a>
      </div>
    </div>
  </div>
  <div class="wrapper">
    <div class="hero">
      <h1>Useragent Header</h1></div>
    <div class="card">
      <h1>Victim page</h1>
  <p>This page prints the User-Agent header (INTENTIONALLY VULNERABLE).</p>

  <div style="padding:12px;border:1px solid #ccc;">
    <strong>User-Agent:</strong>
    <?php
      // VULNERABLE: echoing user-agent without escaping for demo only
      echo $_SERVER['HTTP_USER_AGENT'];
    ?>
  </div>
    </div>
    <div class="footer">cyber-course</div>
  </div>
</body>
</html>