<?php
// リクエストURLを取得
$request_uri = $_SERVER['REQUEST_URI'];

// ルートへのアクセスまたはindex.htmlへのアクセスの場合
if ($request_uri == '/' || $request_uri == '/index.html' || $request_uri == '/index.php') {
    include('index.html');
    exit;
}

// 実ファイルが存在する場合は、そのファイルを表示
$file_path = '.' . $request_uri;
if (file_exists($file_path) && !is_dir($file_path)) {
    // ファイルの種類に基づいて適切なContent-Typeを設定
    $extension = pathinfo($file_path, PATHINFO_EXTENSION);
    switch ($extension) {
        case 'html':
        case 'htm':
            header('Content-Type: text/html');
            break;
        case 'css':
            header('Content-Type: text/css');
            break;
        case 'js':
            header('Content-Type: application/javascript');
            break;
        case 'jpg':
        case 'jpeg':
            header('Content-Type: image/jpeg');
            break;
        case 'png':
            header('Content-Type: image/png');
            break;
        case 'svg':
            header('Content-Type: image/svg+xml');
            break;
        case 'webp':
            header('Content-Type: image/webp');
            break;
        // 他のファイルタイプも必要に応じて追加
    }
    readfile($file_path);
    exit;
}

// それ以外は404エラーを表示
header('HTTP/1.0 404 Not Found');
include('404.html');
?> 