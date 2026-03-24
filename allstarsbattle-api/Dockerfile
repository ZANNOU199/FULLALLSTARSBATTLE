FROM php:8.3-apache

RUN apt-get update && apt-get install -y \
    git curl libpq-dev mariadb-client libzip-dev zip unzip \
    && docker-php-ext-install pdo_mysql pdo_pgsql zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Enable mods and disable conflicts
RUN a2dismod mpm_event mpm_worker || true && a2enmod mpm_prefork rewrite

WORKDIR /var/www/html
COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist
RUN mkdir -p storage/logs storage/app storage/framework/cache storage/framework/sessions storage/framework/views \
 && chmod -R 777 storage bootstrap/cache
RUN cp .env.example .env || true
RUN php artisan key:generate --force
RUN php artisan optimize:clear || true
RUN php artisan config:cache || true
RUN php artisan route:clear || true

# Configure Apache to listen on dynamic PORT (Railway default 8080)
RUN sed -i 's/Listen 80/Listen ${PORT:-8080}/g' /etc/apache2/ports.conf && \
    sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-available/000-default.conf && \
    sed -i 's/<VirtualHost \*:80>/<VirtualHost *:${PORT:-8080}>/g' /etc/apache2/sites-available/000-default.conf

EXPOSE 8080
CMD ["apache2-foreground"]
