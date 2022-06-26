<?php

$path    = './';
$files = scandir($path);
$files = array_diff(scandir($path), array(".", "..", ".DS_Store", "index.php"));
foreach ($files as $file): 
  if (is_dir($file)) { continue; }
  ?>
  <p><a href="<?= $file ?>"><?= $file ?></a></p>
<?php endforeach ?>