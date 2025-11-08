#!/usr/bin/env bash

# Generate all icon sizes from unwhelm.svg
# Run this script from the project root: bash scripts/generate-icons.sh
#
# Prerequisites:
#   - ImageMagick (magick/convert command)
#   - Node.js & npm (for npx to download pwa-asset-generator)

set -e

# Change to project root if running from scripts directory
if [ "$(basename "$PWD")" = "scripts" ]; then
    cd ..
fi

SVG_FILE="public/unwhelm.svg"
ICONS_DIR="public/icons"

# Create icons directory if it doesn't exist
mkdir -p "$ICONS_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Icon Generator for unwhelm"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Step 1: Generating icons from $SVG_FILE..."
echo ""

# PWA manifest icon sizes
SIZES=(72 96 128 144 152 192 384 512)

for size in "${SIZES[@]}"; do
    echo "  Generating ${size}x${size}..."
    magick "$SVG_FILE" -resize "${size}x${size}" -background none "$ICONS_DIR/icon-${size}x${size}.png"
done

# Generate favicon.ico (multiple sizes in one file: 16, 32, 48)
echo "  Generating favicon.ico..."
magick "$SVG_FILE" -resize 16x16 -background none /tmp/favicon-16.png
magick "$SVG_FILE" -resize 32x32 -background none /tmp/favicon-32.png
magick "$SVG_FILE" -resize 48x48 -background none /tmp/favicon-48.png
magick /tmp/favicon-16.png /tmp/favicon-32.png /tmp/favicon-48.png public/favicon.ico
rm /tmp/favicon-*.png

# Generate apple-touch-icon (180x180 - standard)
echo "  Generating apple-touch-icon.png..."
magick "$SVG_FILE" -resize 180x180 -background none public/apple-touch-icon.png

# Generate legacy iOS touch icons
echo "  Generating iOS touch icons..."
magick "$SVG_FILE" -resize 60x60 -background none "$ICONS_DIR/touch-icon-iphone.png"
magick "$SVG_FILE" -resize 120x120 -background none "$ICONS_DIR/touch-icon-iphone-retina.png"
magick "$SVG_FILE" -resize 76x76 -background none "$ICONS_DIR/touch-icon-ipad.png"
magick "$SVG_FILE" -resize 152x152 -background none "$ICONS_DIR/touch-icon-ipad-retina.png"

# Generate Windows tile
echo "  Generating Windows mstile..."
magick "$SVG_FILE" -resize 150x150 -background none "$ICONS_DIR/mstile-150x150.png"

echo "✓ Step 1 complete!"
echo ""

# Generate splash screens manually (only the sizes we actually use)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Generating iOS splash screens..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Generating only the splash sizes used in layout.tsx..."
echo ""

# Only generate the 7 splash screen sizes actually used in layout.tsx
SPLASH_SIZES=(
    "2048x2732"  # iPad Pro 12.9"
    "1668x2224"  # iPad Pro 10.5"
    "1536x2048"  # iPad Pro 9.7"
    "1125x2436"  # iPhone X/XS/11 Pro
    "1242x2208"  # iPhone 6+/7+/8+
    "750x1334"   # iPhone 6/7/8
    "640x1136"   # iPhone 5
)

for size in "${SPLASH_SIZES[@]}"; do
    width=$(echo $size | cut -d'x' -f1)
    height=$(echo $size | cut -d'x' -f2)
    echo "  Generating ${size}..."
    magick "$SVG_FILE" -resize "${width}x${height}" -gravity center -background white -extent "${width}x${height}" "$ICONS_DIR/apple-splash-${size}.png"
done

echo ""
echo "✓ Step 2 complete!"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ All Done!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Generated files:"
echo ""
echo "Browser Icons:"
echo "  ✓ public/favicon.ico (16, 32, 48)"
echo "  ✓ public/apple-touch-icon.png (180)"
echo ""
echo "PWA Manifest Icons:"
for size in "${SIZES[@]}"; do
    echo "  ✓ public/icons/icon-${size}x${size}.png"
done
echo ""
echo "iOS Touch Icons:"
echo "  ✓ public/icons/touch-icon-iphone.png (60)"
echo "  ✓ public/icons/touch-icon-iphone-retina.png (120)"
echo "  ✓ public/icons/touch-icon-ipad.png (76)"
echo "  ✓ public/icons/touch-icon-ipad-retina.png (152)"
echo ""
echo "Windows:"
echo "  ✓ public/icons/mstile-150x150.png (150)"

echo ""
echo "Apple Splash Screens (7 sizes):"
for size in "${SPLASH_SIZES[@]}"; do
    echo "  ✓ public/icons/apple-splash-${size}.png"
done

echo ""
