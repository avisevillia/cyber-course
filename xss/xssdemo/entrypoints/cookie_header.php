<?php
// cookies.php - minimal demo

$allowed = ['light','dark','blue'];

// handle POST from dropdown (server-side validation)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $chosen = $_POST['theme'] ?? '';
    if (in_array($chosen, $allowed, true)) {
        // set cookie (HttpOnly=false so JS can read it for demo)
        setcookie('theme', $chosen, time()+86400, '/');
        // update for this request
        $_COOKIE['theme'] = $chosen;
        $msg = "Theme set to {$chosen}";
    } else {
        $msg = "Invalid theme - rejected by server";
    }
}

// current theme from cookie (vulnerable echo intentionally)
$current = $_COOKIE['theme'] ?? 'default';
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Cookie Header</title>
  <link rel="stylesheet" href="/assets/style.css"/>
</head>
<body>
  <div class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <div class="brand-badge">XSS</div>
        <div>Cookie Header</div>
      </div>
      <div class="nav">
        <a class="pill" href="/index.html">← Back to index</a>
      </div>
    </div>
  </div>
  <div class="wrapper">
    <div class="hero">
      <h1>Cookie Header</h1></div>
    <div class="card">
      <h1>Theme demo (simple)</h1>

  <?php if (!empty($msg)): ?>
    <p><em><?php echo htmlspecialchars($msg, ENT_QUOTES, 'UTF-8'); ?></em></p>
  <?php endif; ?>

  <p><strong>Your current theme is:</strong> <?php echo $current; ?></p>
  <!-- ^ intentionally not escaped so cookie-injection demo will execute -->

  <form method="post" action="cookie_header.php">
    <label>
      Choose theme:
      <select name="theme">
        <option value="light"<?php if ($current==='light') echo ' selected'; ?>>Light</option>
        <option value="dark"<?php if ($current==='dark') echo ' selected'; ?>>Dark</option>
        <option value="blue"<?php if ($current==='blue') echo ' selected'; ?>>Blue</option>
      </select>
    </label>
    <button type="submit">Change</button>
  </form>
    </div>
    <div class="footer">cyber-course</div>
  </div>
</body>
</html>