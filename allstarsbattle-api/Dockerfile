FROM php:8.3-apache

RUN apt-get update && apt-get install -y \
    git curl libpq-dev mariadb-client zip unzip \
    && docker-php-ext-install pdo_mysql pdo_pgsql zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN a2enmod rewrite

WORKDIR /var/www/html
COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist
RUN mkdir -p storage/logs storage/app storage/framework/cache storage/framework/sessions storage/framework/views \
 && chmod -R 777 storage bootstrap/cache
RUN cp .env.example .env || true
RUN php artisan key:generate --force
RUN php artisan optimize:clear || true
RUN php artisan config:cache || true
# Ne pas faire : php artisan route:cache
RUN php artisan route:clear || true

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
EXPOSE 80
CMD ["apache2-foreground"]
