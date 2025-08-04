# PWA Icons Guide

This directory contains the icon template and configuration files for the PWA.

## Icons Needed

To complete the PWA setup, you'll need to generate the following icons from the `icon.svg` template:

### Standard PWA Icons
- `icon-72x72.png` (72x72px)
- `icon-96x96.png` (96x96px)
- `icon-128x128.png` (128x128px)
- `icon-144x144.png` (144x144px)
- `icon-152x152.png` (152x152px)
- `icon-192x192.png` (192x192px)
- `icon-384x384.png` (384x384px)
- `icon-512x512.png` (512x512px)

### iOS Touch Icons
- `touch-icon-iphone.png` (120x120px)
- `touch-icon-ipad.png` (152x152px)
- `touch-icon-iphone-retina.png` (180x180px)
- `touch-icon-ipad-retina.png` (167x167px)

### iOS Splash Screens (Optional but recommended)
- `apple-splash-2048-2732.jpg` (2048x2732px) - iPad Pro 12.9"
- `apple-splash-1668-2224.jpg` (1668x2224px) - iPad Pro 11"
- `apple-splash-1536-2048.jpg` (1536x2048px) - iPad Air/Pro 10.5"
- `apple-splash-1125-2436.jpg` (1125x2436px) - iPhone X/11 Pro
- `apple-splash-1242-2208.jpg` (1242x2208px) - iPhone 6+/7+/8+ Plus
- `apple-splash-750-1334.jpg` (750x1334px) - iPhone 6/7/8
- `apple-splash-640-1136.jpg` (640x1136px) - iPhone 5/SE

### Windows Tiles
- `mstile-150x150.png` (150x150px)

## How to Generate Icons

You can use online tools like:
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [Real Favicon Generator](https://realfavicongenerator.net/)
- Or any image conversion tool

### Using PWA Asset Generator (Recommended)
```bash
npx pwa-asset-generator icon.svg ./public/icons --background "#000000" --padding "10%"
```

### Using ImageMagick (if available)
```bash
# Example for creating one icon
convert icon.svg -resize 192x192 icon-192x192.png
```

## Files Already Created
- `icon.svg` - Base SVG template
- `browserconfig.xml` - Windows tile configuration
- This README file