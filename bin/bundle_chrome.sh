#!/usr/bin/env sh

# Change to the project root directory
cd "$(dirname "$0")/.." || exit

cp build/selectorgadget_combined.css chrome/combined.css
cat chrome/header.js build/selectorgadget_combined.min.js chrome/footer.js > chrome/combined.js
rm -f extension.zip
zip -r extension.zip chrome
