#!/bin/sh
set -e

cd /var/www/html

echo "========================================="
echo "Starting Laravel API Server"
echo "PHP Version: $(php -v | head -1)"
echo "Working Directory: $(pwd)"
echo "Public Directory: $(pwd)/public"
echo "Port: 8080"
echo "========================================="
echo ""

php -S 0.0.0.0:8080 -t public
