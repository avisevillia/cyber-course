<?php
// search.php (vulnerable demo)
$q = $_GET['q'] ?? '';
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Querystring</title>
  <link rel="stylesheet" href="/assets/style.css"/>
</head>
<body>
  <div class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <div class="brand-badge">XSS</div>
        <div>Querystring</div>
      </div>
      <div class="nav">
        <a class="pill" href="/index.html">← Back to index</a>
      </div>
    </div>
  </div>
  <div class="wrapper">
    <div class="hero">
      <h1>Querystring</h1></div>
    <div class="card">
      <h1>Search</h1>

    <form method="get" action="">
      <input type="text" name="q" value="<?php echo $q; ?>" placeholder="Search...">
      <button type="submit">Search</button>
    </form>

    <p>Results for: <?php echo $q; ?></p>
    </div>
    <div class="footer">cyber-course</div>
  </div>
</body>
</html>