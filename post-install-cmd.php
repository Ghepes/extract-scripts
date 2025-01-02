<?php
$sourceDirs = ['view-source:https://cn.ghepes.net/sitemap.xml'];
$targetDir = 'assets/';

foreach ($sourceDirs as $dir) {
    $files = glob($dir . '/**/*.{css,js}', GLOB_BRACE);
    foreach ($files as $file) {
        $relativePath = str_replace($dir . '/', '', $file);
        $dest = $targetDir . $relativePath;
        if (!is_dir(dirname($dest))) {
            mkdir(dirname($dest), 0777, true);
        }
        copy($file, $dest);
    }
}