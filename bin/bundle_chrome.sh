#!/usr/bin/env sh

set -e

# Change to the project root directory
cd "$(dirname "$0")/.." || exit

# Remove existing chrome directory and create a new one
rm -rf chrome
mkdir -p chrome/icons

# Copy static files from src
cp src/manifest.json chrome/manifest.json
cp src/background.js chrome/background.js
cp src/icons/*.png chrome/icons/

# Copy compiled files
cp build/selectorgadget_combined.css chrome/combined.css

# Check for header.js and footer.js in src directory
if [ ! -f src/header.js ]; then
    echo "Error: header.js not found in src directory. Aborting build."
    exit 1
fi

if [ ! -f src/footer.js ]; then
    echo "Error: footer.js not found in src directory. Aborting build."
    exit 1
fi

# Create combined.js
cat src/header.js build/selectorgadget_combined.min.js src/footer.js > chrome/combined.js

# Create the extension zip file
rm -f extension.zip
zip -r extension.zip chrome

echo "Chrome extension bundle created successfully."
