#!/bin/bash
set -e

echo "Installing Chromium browser..."

# The base image is Fedora, so use dnf for package installation
dnf install -y chromium

# Verify installation
chromium-browser --version || chromium --version || echo "Chromium installed (version command may vary)"

# Create symlink for Playwright MCP
echo "Creating symlink for Playwright..."
mkdir -p /opt/google/chrome
ln -sf /usr/lib64/chromium-browser/chromium-browser /opt/google/chrome/chrome

echo "Chromium installation complete!"
