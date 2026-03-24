#!/bin/bash
set -e

# Disable conflicting MPM modules
a2dismod mpm_event mpm_worker || true

# Enable only prefork MPM
a2enmod mpm_prefork

# Start Apache in foreground
exec apache2-foreground