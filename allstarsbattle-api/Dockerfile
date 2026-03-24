# Base image
FROM php:8.3-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpq-dev \
    mariadb-client \
    zip unzip \
    && docker-php-ext-install pdo_mysql pdo_pgsql zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy project files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Set permissions
RUN mkdir -p storage/logs storage/app storage/framework/cache storage/framework/sessions storage/framework/views \
    && chmod -R 777 storage bootstrap/cache

# Copy .env if absent and generate key
RUN cp .env.example .env || true
RUN php artisan key:generate --force

# Laravel optimization
RUN php artisan optimize:clear || true
RUN php artisan config:cache || true
RUN php artisan route:cache || true

# Set Apache DocumentRoot to public
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

# Expose HTTP
EXPOSE 80

# Start Apache in foreground
CMD ["apache2-foreground"]
