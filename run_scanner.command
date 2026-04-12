#!/bin/bash
echo "=========================================="
echo "   Dogecoin Wallet Scanner"
echo "=========================================="
echo ""

# Get the folder this script lives in
DIR="$(cd "$(dirname "$0")" && pwd)"

# If a file was dragged onto this, use it
if [ -n "$1" ]; then
    CSV_PATH="$1"
else
    # No file dragged — open a file picker
    CSV_PATH=$(osascript -e 'tell application "Finder" to activate' -e 'POSIX path of (choose file with prompt "Pick your CSV file with Dogecoin addresses" of type {"csv","txt"})')
    if [ -z "$CSV_PATH" ]; then
        echo "No file selected. Exiting."
        echo ""
        read -p "Press Enter to close..."
        exit 0
    fi
fi

echo "Scanning: $CSV_PATH"
echo ""

# Try python3 first, then python
if command -v python3 &> /dev/null; then
    PYTHON=python3
elif command -v python &> /dev/null; then
    PYTHON=python
else
    echo "Python is not installed!"
    echo ""
    echo "Install it by:"
    echo "  1. Go to https://www.python.org/downloads/"
    echo "  2. Download and install Python"
    echo "  3. Then try again"
    echo ""
    read -p "Press Enter to close..."
    exit 1
fi

$PYTHON "$DIR/doge_scanner.py" "$CSV_PATH"

echo ""
read -p "Press Enter to close..."
