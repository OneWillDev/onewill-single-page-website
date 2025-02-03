FROM php:8.1-apache

# 1. apt-get update & mbstringのインストール (sendmailは削除)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libonig-dev \
    && docker-php-ext-install mbstring \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 2. ソースコードを /var/www/html にコピー
COPY . /var/www/html

# 3. ポート80を公開
EXPOSE 80

# 4. Apache をフォアグラウンドで起動
CMD ["apache2-foreground"]