<?php


$uploaded_name = '';
$uploadDir = realpath(__DIR__ . '/../uploads');
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['up'])) {
    $tmp = $_FILES['up']['tmp_name'];
    $orig = $_FILES['up']['name']; // <-- attacker-controlled filename
    $dst = $uploadDir . '/' . basename($orig); // naive storage

    if (file_exists($dst)) {
      // attempt to unlink; if unlink fails, record error
      if (!@unlink($dst)) {
          $uploaded_name = 'UPLOAD_FAILED: cannot remove existing file';
      }
    }

    if (move_uploaded_file($tmp, $dst)) {
        $uploaded_name = $orig;
    } else {
        $uploaded_name = 'UPLOAD_FAILED';
    }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Upload File</title>
  <link rel="stylesheet" href="/assets/style.css"/>
</head>
<body>
  <div class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <div class="brand-badge">XSS</div>
        <div>Upload File</div>
      </div>
      <div class="nav">
        <a class="pill" href="/index.html">← Back to index</a>
      </div>
    </div>
  </div>
  <div class="wrapper">
    <div class="hero">
      <h1>Upload File</h1></div>
    <div class="card">
      <h1>Vulnerable Upload Demo</h1>

  <form method="post" enctype="multipart/form-data">
    <input type="file" name="up">
    <button type="submit">Upload</button>
  </form>

  <?php if ($uploaded_name): ?>
    <h2>Uploaded</h2>
    <!-- VULNERABLE: original filename echoed without escaping -->
    <p>Filename: <?php echo $uploaded_name; ?></p>

    <p>File on disk (unsafe): <a href="/uploads/<?php echo htmlspecialchars(basename($uploaded_name)); ?>">
      <?php echo htmlspecialchars(basename($uploaded_name)); ?></a></p>
  <?php endif; ?>
    </div>
    <div class="footer">cyber-course</div>
  </div>
</body>
</html>