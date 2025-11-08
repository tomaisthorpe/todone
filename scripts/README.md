# Scripts

Utility scripts for the unwhelm project.

## generate-icons.sh

Generates all required icon files from the source SVG logo.

### Usage

```bash
bash scripts/generate-icons.sh
```

### Prerequisites

- **ImageMagick** (required) - For all icon and splash screen generation
  - Usually available via system package manager
  - On NixOS: included in development shell

### What it generates

**Browser Icons:**
- `public/favicon.ico` - Multi-size favicon (16, 32, 48)
- `public/apple-touch-icon.png` - iOS home screen icon (180x180)

**PWA Manifest Icons:**
- `public/icons/icon-72x72.png` through `icon-512x512.png`
- Used by the PWA manifest for installable app icons

**iOS Touch Icons (Legacy):**
- `public/icons/touch-icon-iphone.png` (60x60)
- `public/icons/touch-icon-iphone-retina.png` (120x120)
- `public/icons/touch-icon-ipad.png` (76x76)
- `public/icons/touch-icon-ipad-retina.png` (152x152)

**Windows:**
- `public/icons/mstile-150x150.png` - Windows tile icon

**Apple Splash Screens (7 sizes):**
- `apple-splash-2048x2732.png` - iPad Pro 12.9"
- `apple-splash-1668x2224.png` - iPad Pro 10.5"
- `apple-splash-1536x2048.png` - iPad Pro 9.7"
- `apple-splash-1125x2436.png` - iPhone X/XS/11 Pro
- `apple-splash-1242x2208.png` - iPhone 6+/7+/8+
- `apple-splash-750x1334.png` - iPhone 6/7/8
- `apple-splash-640x1136.png` - iPhone 5

### Notes

- The script can be run from anywhere - it automatically detects if you're in the scripts directory
- All icons are generated from `public/unwhelm.svg`
- If you update the logo, just re-run this script to regenerate all icons
- Only the 7 splash screen sizes actually used in `app/layout.tsx` are generated (not the full 40+ variants)
