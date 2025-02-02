# 1. PHP + Apache の公式イメージを使用 (8.1は例)
FROM php:8.1-apache

# 2. mbstring 等、必要な拡張をインストール（メール送信や文字列処理に必要）
RUN docker-php-ext-install mbstring

# 3. ソースコードを /var/www/html にコピー
#    "index.html", "send_mail.php", "public" フォルダなどすべて含める
COPY . /var/www/html

# 4. ポート80を公開
EXPOSE 80

# 5. Apache をフォアグラウンドで起動
CMD ["apache2-foreground"]
