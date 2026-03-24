FROM php:8.3-cli

WORKDIR /var/www

COPY . /var/www/

RUN apt-get update -y && apt-get install -y curl zip unzip git libzip-dev &&\
    docker-php-ext-install pdo_mysql zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN composer install --no-dev --no-interaction

EXPOSE 8080

CMD ["php", "-S", "127.0.0.1:8080", "-t", "public"]

