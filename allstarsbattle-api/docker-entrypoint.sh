#!/bin/bash
set -e

# Set Apache to listen on PORT (default 8080 for Railway)
export APACHE_PORT=${PORT:-8080}

# Update Apache ports configuration
sed -i "s/Listen 80/Listen ${APACHE_PORT}/g" /etc/apache2/ports.conf
sed -i "s/:80/:${APACHE_PORT}/g" /etc/apache2/sites-available/000-default.conf

# Disable conflicting MPM modules
a2dismod mpm_event mpm_worker || true

# Enable only prefork MPM
a2enmod mpm_prefork

# Start Apache in foreground
exec apache2-foreground