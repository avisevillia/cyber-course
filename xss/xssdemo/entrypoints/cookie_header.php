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
<html><head><meta charset="utf-8"><title>cookies.php (simple)</title></head>
<body>
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

</body></html>

