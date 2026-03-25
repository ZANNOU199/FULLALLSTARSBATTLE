FROM php:8.3-cli

# Force no-cache rebuild
ARG CACHE_BUST=1

RUN apt-get update && apt-get install -y \
    git curl libpq-dev libzip-dev zip unzip \
    && docker-php-ext-install pdo_mysql pdo_pgsql zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html
COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist
RUN mkdir -p storage/logs storage/app storage/framework/cache storage/framework/sessions storage/framework/views \
 && chmod -R 777 storage bootstrap/cache
RUN cp .env.example .env || true
RUN mkdir -p database && touch database/database.sqlite && chmod 666 database/database.sqlite
RUN php artisan key:generate --force
RUN php artisan optimize:clear || true
RUN php artisan config:cache || true
RUN php artisan route:clear || true

EXPOSE 8080
CMD ["php", "-S", "0.0.0.0:8080", "-t", "public"]
