#!/usr/bin/env pwsh
# Publish Pact Contracts to Broker
# gmao-hiansa (GMAO - Gestión de Mantenimiento Asistido por Ordenador)

$ErrorActionPreference = "Stop"

Write-Host "Publishing Pact contracts to broker..." -ForegroundColor Green

# Environment variables (configure in CI/CD)
$PACT_BROKER_URL = $env:PACT_BROKER_URL ?? "http://localhost:9292"
$PACT_BROKER_USERNAME = $env:PACT_BROKER_USERNAME ?? "pact_user"
$PACT_BROKER_PASSWORD = $env:PACT_BROKER_PASSWORD ?? "pact_password"
$CONSUMER_VERSION = $env:CONSUMER_VERSION ?? "1.0.0"

# Publish pacts
npx pact-broker publish ./pacts `
  --broker-base-url=$PACT_BROKER_URL `
  --broker-username=$PACT_BROKER_USERNAME `
  --broker-password=$PACT_BROKER_PASSWORD `
  --consumer-app-version=$CONSUMER_VERSION `
  --tag-with-git-branch

Write-Host "Pacts published successfully!" -ForegroundColor Green
