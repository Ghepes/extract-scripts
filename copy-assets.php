<?php
$sourceDirs = [
    'wordpress/'
];
$targetDir = 'assets/';

foreach ($sourceDirs as $dir) {
    if (!is_dir($dir)) {
        continue;
    }

    $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
    foreach ($files as $file) {
        if ($file->isFile() && preg_match('/\.(css|js)$/', $file->getFilename())) {
            $relativePath = str_replace($dir . '/', '', $file->getPathname());
            $dest = $targetDir . $relativePath;

            if (!is_dir(dirname($dest))) {
                mkdir(dirname($dest), 0777, true);
            }
            copy($file->getPathname(), $dest);
        }
    }
}