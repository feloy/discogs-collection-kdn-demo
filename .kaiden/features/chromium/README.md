# Chromium Browser Dev Container Feature

This local dev container feature installs Chromium browser for use with Playwright and other browser automation tools.

## What it does

- Installs Chromium browser using `dnf` (Fedora package manager)
- Provides the browser executable at `/usr/bin/chromium-browser` or `/usr/bin/chromium`

## Usage

This feature is automatically applied when the workspace is registered with `kdn init`. It's designed for the Fedora-based workspace image.

## Playwright Integration

After Chromium is installed, Playwright can use it directly without needing to download its own browser binaries:

```javascript
// Playwright will find the system-installed Chromium
const browser = await chromium.launch({ channel: 'chromium' });
```

Or via MCP server commands through the Playwright MCP integration.

## Technical Details

- **Base image**: Fedora (uses `dnf` package manager)
- **Package**: `chromium` from Fedora repositories
- **Executable paths**: 
  - `/usr/bin/chromium-browser`
  - `/usr/bin/chromium`

## Maintenance

The feature uses the default Chromium version from Fedora repositories. To update Chromium, re-register the workspace after Fedora updates the package.
