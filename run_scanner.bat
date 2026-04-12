@echo off
echo ==========================================
echo    Dogecoin Wallet Scanner
echo ==========================================
echo.

REM If a file was dragged onto this .bat, use it
if "%~1"=="" (
    echo HOW TO USE:
    echo   Drag and drop your CSV file onto this icon.
    echo.
    echo   That's it. Just grab your CSV file and drop it
    echo   right on top of this "run_scanner" icon.
    echo.
    pause
    exit /b
)

echo Scanning: %~1
echo.

REM Install dependencies and run
python "%~dp0doge_scanner.py" "%~1"

if errorlevel 1 (
    echo.
    echo Something went wrong. Make sure Python is installed.
    echo Download it from https://www.python.org/downloads/
    echo IMPORTANT: Check "Add Python to PATH" during install.
    echo.
)

pause
