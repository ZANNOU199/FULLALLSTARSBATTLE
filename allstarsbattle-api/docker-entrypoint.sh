#!/bin/bash
PORT=${PORT:-8080}
exec php -S 0.0.0.0:$PORT -t public
