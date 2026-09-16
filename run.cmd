@echo off
if "%~1"=="krishna" (
    echo Starting the DVAN.AI project...
    npm run dev
) else (
    echo Usage: run krishna
)
