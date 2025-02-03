FROM php:8.1-apache

# Composerインストール(簡易的な方法)
RUN apt-get update && \
    apt-get install -y zip unzip && \
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
    rm composer-setup.php

# mbstringなどの拡張モジュールインストール
RUN apt-get install -y --no-install-recommends libonig-dev \
    && docker-php-ext-install mbstring \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ソースコピー
COPY . /var/www/html

# Composer install 実行
WORKDIR /var/www/html
RUN composer install --no-dev --optimize-autoloader

EXPOSE 80
CMD ["apache2-foreground"]