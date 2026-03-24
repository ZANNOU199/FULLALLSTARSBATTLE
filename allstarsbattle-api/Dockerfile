FROM php:8.3-apache

# Install minimal dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpq-dev \
    mariadb-client \
    && docker-php-ext-install pdo_mysql pdo_pgsql

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Ensure only one Apache MPM is enabled (avoid "More than one MPM loaded")
RUN a2dismod mpm_event mpm_worker || true && a2enmod mpm_prefork
# Enable Apache mod_rewrite
RUN a2enmod rewrite

WORKDIR /var/www/html

# Copy application
COPY . .

# Install PHP dependencies (skip dev, skip scripts to avoid hangs)
RUN composer install --no-dev --optimize-autoloader --no-scripts 2>&1 | tail -20

# Create required directories
RUN mkdir -p storage/logs storage/app storage/framework && chmod -R 777 storage

# Set DocumentRoot
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-enabled/*.conf

EXPOSE 80

CMD ["apache2-foreground"]
