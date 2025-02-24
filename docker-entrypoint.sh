#!/bin/sh
set -e

if [ -z "$PYPOWERWALL_URL" ]; then
  PYPOWERWALL_URL=http://localhost:8657
fi
PYPOWERWALL_URL=$(echo $PYPOWERWALL_URL | tr -d '"')
echo "Replacing PYPOWERWALL_URL with $PYPOWERWALL_URL"
find /app/.next/ -type f -exec sed -i "s|PYPOWERWALL_URL|$PYPOWERWALL_URL|g" {} \;

# Execute the container's main process (CMD in Dockerfile)
exec "$@"