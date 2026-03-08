#!/usr/bin/env pwsh
# Can-I-Deploy Check
# gmao-hiansa (GMAO - Gestión de Mantenimiento Asistido por Ordenador)

$ErrorActionPreference = "Stop"

Write-Host "Checking if deployment is safe..." -ForegroundColor Green

# Environment variables (configure in CI/CD)
$PACT_BROKER_URL = $env:PACT_BROKER_URL ?? "http://localhost:9292"
$PACT_BROKER_USERNAME = $env:PACT_BROKER_USERNAME ?? "pact_user"
$PACT_BROKER_PASSWORD = $env:PACT_BROKER_PASSWORD ?? "pact_password"
$CONSUMER_VERSION = $env:CONSUMER_VERSION ?? "1.0.0"

# Check can-i-deploy
npx pact-broker can-i-deploy `
  --broker-base-url=$PACT_BROKER_URL `
  --broker-username=$PACT_BROKER_USERNAME `
  --broker-password=$PACT_BROKER_PASSWORD `
  --pacticipant=gmao-frontend `
  --version=$CONSUMER_VERSION `
  --to-environment=production

Write-Host "Deployment check complete!" -ForegroundColor Green
