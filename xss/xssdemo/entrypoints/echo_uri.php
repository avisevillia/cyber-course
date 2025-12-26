<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Echo Uri</title>
  <link rel="stylesheet" href="/assets/style.css"/>
</head>
<body>
  <div class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <div class="brand-badge">XSS</div>
        <div>Echo Uri</div>
      </div>
      <div class="nav">
        <a class="pill" href="/index.html">← Back to index</a>
      </div>
    </div>
  </div>
  <div class="wrapper">
    <div class="hero">
      <h1>Echo Uri</h1></div>
    <div class="card">
      <h1>Something broke</h1>
    <pre>Request: <?php echo urldecode($_SERVER['REQUEST_URI']); ?></pre> <!-- vulnerable -->
    </div>
    <div class="footer">cyber-course</div>
  </div>
</body>
</html>