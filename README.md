# ONE WILL 企業サイト

建設×ITで未来を拓く企業「ONE WILL」の公式ウェブサイトです。

## 開発環境のセットアップ

### ローカルサーバーの起動
```
./start-server.sh
```

これにより、http://localhost:8080 でサイトが起動します。

## 本番環境での設定

### Apacheサーバーの場合
`.htaccess`ファイルが適用され、404エラーページが自動的に設定されます。
Apache モジュール `mod_rewrite` が有効になっていることを確認してください。

### Nginxサーバーの場合
以下のような設定をサーバー設定に追加してください:

```nginx
server {
    # 他の設定...
    
    # 404エラーページの設定
    error_page 404 /404.html;
    location = /404.html {
        root /path/to/your/site;
        internal;
    }
    
    # 静的ファイルのキャッシュ設定
    location ~* \.(html|css|js|jpg|jpeg|png|webp|svg)$ {
        expires 1d;
        add_header Cache-Control "public, must-revalidate";
    }
}
```

### PHP-FPMを使用する場合
`index.php`ファイルがすべてのリクエストをハンドリングするように設定されています。
適切なPHP-FPM設定を行い、Webサーバーからのリクエストを処理できるようにしてください。

## ファイル構成

- `index.html` - メインページ
- `404.html` - エラーページ
- `css/` - スタイルシート
- `js/` - JavaScriptファイル
- `public/` - 画像やアイコンなどの静的ファイル
- `.htaccess` - Apacheサーバー設定
- `index.php` - PHPルーティング
- `start-server.sh` - 開発用サーバー起動スクリプト（本番では不要）

## 注意事項

- `start-server.sh`は開発環境でのみ使用します。本番環境では適切なWebサーバー（Apache/Nginx等）を使用してください。
- 404ページが正しく表示されるためには、サーバー設定が適切に行われている必要があります。
- 本番環境でのパフォーマンス向上のため、静的ファイルの圧縮やキャッシュ設定を検討してください。 