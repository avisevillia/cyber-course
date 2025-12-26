<?php
// urlpath.php - fixed: avoid PATH_INFO duplication
// Raw PATH_INFO (for demonstration) and a safe escaped version:
$name = ltrim($_SERVER['PATH_INFO'] ?? '/', '/'); // e.g. "john.doe"
//$name = htmlspecialchars($raw, ENT_QUOTES, 'UTF-8');

// SCRIPT_NAME is the script path without PATH_INFO (e.g. "/urlpath.php")
$script = $_SERVER['SCRIPT_NAME'];
$self = htmlspecialchars($script, ENT_QUOTES, 'UTF-8');
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Urlpath</title>
  <link rel="stylesheet" href="/assets/style.css"/>
</head>
<body>
  <div class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <div class="brand-badge">XSS</div>
        <div>Urlpath</div>
      </div>
      <div class="nav">
        <a class="pill" href="/index.html">← Back to index</a>
      </div>
    </div>
  </div>
  <div class="wrapper">
    <div class="hero">
      <h1>Urlpath</h1></div>
    <div class="card">
      <h1>Profile: <?php echo $name; ?></h1> <!-- vulnerable: echoes raw PATH_INFO -->

      <!-- link to this same file with different PATH_INFO values -->
    <a href="<?php echo $self; ?>/alice">Alice</a>
    <a href="<?php echo $self; ?>/bob">Bob</a>
    <a href="<?php echo $self; ?>/john.doe">John Doe</a>

    <hr>

    <h2>Go to profile</h2>
    <p>Type a name and click <strong>Go</strong> (client-side navigation creates the PATH_INFO):</p>   
    <!-- form's action is set to the script root (SCRIPT_NAME) -->
    <form id="gotoForm" action="<?php echo $self; ?>" method="get" onsubmit="goToProfile(event)">
      <input id="username" name="username" placeholder="enter name" style="padding:6px;" />
      <button type="submit">Go</button>
    </form>

    <script>
      // ensure client-side navigation always uses the base script path (no PATH_INFO duplication)
      const base = <?php echo json_encode($self); ?>; // safe JS string with script path
      function goToProfile(e) {
        e.preventDefault();
        const val = document.getElementById('username').value || '';
        // use origin + base to build an absolute URL OR just base (root-relative) + '/' + encoded value
        // Root-relative is fine because SCRIPT_NAME already begins with '/'
        const target = base + '/' + encodeURIComponent(val);
        // navigate to the canonical profile URL
        window.location.href = target;
      }
  </script>
    </div>
    <div class="footer">cyber-course</div>
  </div>
</body>
</html>