param(
    [string]$Action
)

if ($Action -eq "krishna") {
    Write-Host "Starting the DVAN.AI project..." -ForegroundColor Green
    npm run dev
} else {
    Write-Host "Usage: .\run.ps1 krishna (or 'run krishna' if configured in your environment)" -ForegroundColor Yellow
}
