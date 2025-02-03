# ベースイメージに php:8.1-apache を使用
FROM php:8.1-apache

# 1. Composerインストール + mbstring等の拡張をインストール
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        git \
        unzip \
        libonig-dev \
    && docker-php-ext-install mbstring \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer（公式サイトインストーラをダウンロードして配置）
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && rm composer-setup.php

# 2. ソースコードをコピー (Dockerビルド時のコンテキストから)
WORKDIR /var/www/html
COPY . /var/www/html

# 3. Composer インストール (vendor ディレクトリを生成)
RUN composer install --no-dev --optimize-autoloader

# 4. ポート80を公開
EXPOSE 80

# 5. Apache をフォアグラウンドで起動
CMD ["apache2-foreground"]