FROM php:8.2-cli

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    libzip-dev \
    zip \
    mariadb-client \
    && docker-php-ext-install pdo pdo_mysql zip

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-ansi

# Generate app key (if not present)
RUN php artisan key:generate --force || true

EXPOSE 8080

CMD ["php", "-S", "0.0.0.0:8080", "-t", "public"]
