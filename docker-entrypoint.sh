#!/bin/sh
set -e

if [ -z "$PYPOWERWALL_URL" ]; then
  PYPOWERWALL_URL=http://localhost:8657
fi
PYPOWERWALL_URL=$(echo $PYPOWERWALL_URL | tr -d '"')
echo "Replacing PYPOWERWALL_URL with $PYPOWERWALL_URL"
find /app/.next/ -type f -exec sed -i "s|PYPOWERWALL_URL|$PYPOWERWALL_URL|g" {} \;

if [ -z "$DISABLE_BRANDING" ]; then
  DISABLE_BRANDING=false
fi
DISABLE_BRANDING=$(echo $DISABLE_BRANDING | tr -d '"')
echo "Replacing DISABLE_BRANDING with $DISABLE_BRANDING"
find /app/.next/ -type f -exec sed -i "s|DISABLE_BRANDING|$DISABLE_BRANDING|g" {} \;

if [ -z "$SOLAR_ONLY" ]; then
  SOLAR_ONLY=false
fi
SOLAR_ONLY=$(echo $SOLAR_ONLY | tr -d '"')
echo "Replacing SOLAR_ONLY with $SOLAR_ONLY"
find /app/.next/ -type f -exec sed -i "s|SOLAR_ONLY|$SOLAR_ONLY|g" {} \;

# Execute the container's main process (CMD in Dockerfile)
exec "$@"