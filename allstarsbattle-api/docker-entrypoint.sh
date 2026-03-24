#!/bin/bash
set -e

# Set Apache to listen on PORT (Railway sets this automatically)
PORT=${PORT:-8080}

# Update Apache ports configuration
sed -i "s/Listen 80/Listen ${PORT}/g" /etc/apache2/ports.conf
sed -i "s/:80/:${PORT}/g" /etc/apache2/sites-available/000-default.conf

# Disable conflicting MPM modules
a2dismod mpm_event mpm_worker || true

# Enable only prefork MPM
a2enmod mpm_prefork

# Start Apache in foreground
exec apache2-foreground