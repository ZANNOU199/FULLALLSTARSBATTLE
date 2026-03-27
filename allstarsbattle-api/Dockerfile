FROM php:8.3-apache

# Installe les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev zip unzip git curl libpq-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd

# Active mod_rewrite pour Laravel
RUN a2enmod rewrite

# Copie le code source dans le conteneur
COPY . /var/www/html

# Définit le dossier de travail
WORKDIR /var/www/html

# Installe Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Installe les dépendances PHP
RUN composer install --no-dev --optimize-autoloader

# Donne les bons droits
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Configure Apache pour pointer sur public/
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Expose le port 80
EXPOSE 80

# Commande de démarrage
CMD ["apache2-foreground"]
