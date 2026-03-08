#!/usr/bin/env pwsh
# Pact Environment Setup
# gmao-hiansa (GMAO - Gestión de Mantenimiento Asistido por Ordenador)

$ErrorActionPreference = "Stop"

Write-Host "Setting up Pact environment..." -ForegroundColor Green

# Create pacts directory if it doesn't exist
if (-not (Test-Path "./pacts")) {
    New-Item -ItemType Directory -Path "./pacts" | Out-Null
    Write-Host "Created ./pacts directory" -ForegroundColor Yellow
}

# Create pact-logs directory if it doesn't exist
if (-not (Test-Path "./pact-logs")) {
    New-Item -ItemType Directory -Path "./pact-logs" | Out-Null
    Write-Host "Created ./pact-logs directory" -ForegroundColor Yellow
}

# Set environment variables (these can also be set in .env.local)
$env:PACT_BROKER_URL = "http://localhost:9292"
$env:PACT_BROKER_USERNAME = "pact_user"
$env:PACT_BROKER_PASSWORD = "pact_password"
$env:CONSUMER_VERSION = "1.0.0"

Write-Host "Pact environment setup complete!" -ForegroundColor Green
Write-Host "PACT_BROKER_URL=$env:PACT_BROKER_URL" -ForegroundColor Cyan
Write-Host "To change these, set them in your .env.local file" -ForegroundColor Cyan
