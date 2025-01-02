<?php

// URL-ul sitemap-ului
$sitemapUrl = 'view-source:https://cn.ghepes.net/sitemap.xml';
$sitemapContent = @file_get_contents($sitemapUrl);

if ($sitemapContent === false) {
    die("Nu am reușit să obținem sitemap-ul de la URL-ul specificat.\n");
}

// Parsează sitemap-ul folosind SimpleXML
$xml = simplexml_load_string($sitemapContent);

if ($xml === false) {
    die("Nu am reușit să parsez sitemap-ul. Verifică dacă este valid.\n");
}

$namespaces = $xml->getNamespaces(true);
$targetDir = 'assets/';

$urlsToDownload = [];

foreach ($xml->url as $urlEntry) {
    $url = (string)$urlEntry->loc;

    // Filtrăm doar fișierele CSS și JS
    if (preg_match('/\.(css|js)$/', $url)) {
        $urlsToDownload[] = $url;
    }
}

// Descărcăm fiecare fișier CSS sau JS
foreach ($urlsToDownload as $fileUrl) {
    $parsedUrl = parse_url($fileUrl);
    $relativePath = ltrim($parsedUrl['path'], '/');
    $dest = $targetDir . $relativePath;

    // Creează directoarele de destinație dacă nu există
    if (!is_dir(dirname($dest))) {
        mkdir(dirname($dest), 0777, true);
    }

    // Descarcă fișierul și salvează-l local
    $fileContents = @file_get_contents($fileUrl);
    if ($fileContents !== false) {
        file_put_contents($dest, $fileContents);
        echo "Fișierul $fileUrl a fost descărcat cu succes.\n";
    } else {
        echo "Eroare la descărcarea fișierului $fileUrl.\n";
    }
}

