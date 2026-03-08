#!/usr/bin/env pwsh
# Record Consumer Deployment
# gmao-hiansa (GMAO - Gestión de Mantenimiento Asistido por Ordenador)

$ErrorActionPreference = "Stop"

Write-Host "Recording deployment..." -ForegroundColor Green

# Environment variables (configure in CI/CD)
$PACT_BROKER_URL = $env:PACT_BROKER_URL ?? "http://localhost:9292"
$PACT_BROKER_USERNAME = $env:PACT_BROKER_USERNAME ?? "pact_user"
$PACT_BROKER_PASSWORD = $env:PACT_BROKER_PASSWORD ?? "pact_password"
$CONSUMER_VERSION = $env:CONSUMER_VERSION ?? "1.0.0"
$ENVIRONMENT = $env:ENVIRONMENT ?? "production"

# Record deployment
npx pact-broker record-deployment `
  --broker-base-url=$PACT_BROKER_URL `
  --broker-username=$PACT_BROKER_USERNAME `
  --broker-password=$PACT_BROKER_PASSWORD `
  --pacticipant=gmao-frontend `
  --version=$CONSUMER_VERSION `
  --environment=$ENVIRONMENT

Write-Host "Deployment recorded successfully!" -ForegroundColor Green
