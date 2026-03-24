# Base image
FROM php:8.3-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpq-dev \
    mariadb-client \
    zip unzip \
    && docker-php-ext-install pdo_mysql pdo_pgsql zip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Create storage directories and set permissions
RUN mkdir -p storage/logs storage/app storage/framework/cache storage/framework/sessions storage/framework/views
RUN chmod -R 777 storage bootstrap/cache

# Copy example env and generate app key
RUN cp .env.example .env || true
RUN php artisan key:generate --force

# Optimize Laravel
RUN php artisan optimize:clear || true
RUN php artisan config:cache || true
RUN php artisan route:cache || true

# Set Apache DocumentRoot
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-enabled/*.conf

# Expose port 80
EXPOSE 80

# Build timestamp for cache busting
ENV BUILD_TIMESTAMP="2026-03-24T06:45:00Z"

# Start Apache in foreground
CMD ["apache2-foreground"]

