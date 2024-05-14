#!/bin/bash

# Define the paths and configurations
WINDOWS_CONFIG="electron-builder.windows.yml"
MAC_CONFIG="electron-builder.mac.yml"
OUTPUT_DIR="dist"

# Clean up previous builds (optional)
rm -rf "$OUTPUT_DIR"

# Build for Windows
npx electron-builder --config "$WINDOWS_CONFIG" --win --publish always

# Build for macOS
npx electron-builder --config "$MAC_CONFIG" --mac --publish always
