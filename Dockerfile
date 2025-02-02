FROM php:8.1-apache

# 1. パッケージリスト更新 & mbstringに必要なライブラリをインストール
RUN apt-get update && \
    apt-get install -y --no-install-recommends libonig-dev && \
    # 2. mbstring を有効化
    docker-php-ext-install mbstring && \
    # 3. 後片付け (不要なキャッシュ削除など)
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 4. ソースコードを /var/www/html にコピー
COPY . /var/www/html

# 5. ポート80を公開
EXPOSE 80

# 6. Apache をフォアグラウンドで起動
CMD ["apache2-foreground"]
