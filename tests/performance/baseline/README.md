# Performance Baseline Documentation
# Story 0.5: Error Handling, Observability y CI/CD

## Overview

Esta documentación describe el baseline de performance para los endpoints críticos de la aplicación GMAO Hiansa.

## Performance Targets

### Login Endpoint
- **Concurrent Users:** 100
- **Target p95:** < 500ms
- **Error Rate:** < 5%
- **Test Script:** `login-load-test.js`

### Asset Search Endpoint
- **Concurrent Users:** 50
- **Target p95:** < 300ms
- **Error Rate:** < 3%
- **Test Script:** `asset-search-load-test.js`

### Create Work Order Endpoint
- **Concurrent Users:** 20
- **Target p95:** < 1000ms
- **Error Rate:** < 5%
- **Test Script:** `create-ot-load-test.js`

## Running Performance Tests

### Prerequisites

```bash
# Install k6
# Windows: Download from https://k6.io/
# Or use chocolatey:
choco install k6

# Or use npx (Node.js wrapper)
npm install -g k6
```

### Running Tests

```bash
# Set environment variables
export APP_URL="http://localhost:3000"

# Run login load test
k6 run tests/performance/baseline/login-load-test.js

# Run asset search load test
k6 run tests/performance/baseline/asset-search-load-test.js

# Run create work order load test
k6 run tests/performance/baseline/create-ot-load-test.js
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| APP_URL | Base URL de la aplicación | http://localhost:3000 |
| K6_WEB_DASHBOARD | Habilita dashboard web | false |

## Baseline Results (Expected)

### Login Load Test (100 concurrent users)
```
✓ status is 200 or 302
✓ response time < 500ms

checks.........................: 100.00% ✓ 5000 / 5000
data_received..................: 2.5 MB 45 kB/s
data_sent......................: 1.2 MB 22 kB/s
http_req_duration..............: avg=320ms min=50ms med=290ms p(95)=450ms p(99)=520ms
http_req_failed................: 5.00% ✓ 250 / 5000
```

### Asset Search Load Test (50 concurrent users)
```
✓ status is 200
✓ has data array
✓ response time < 300ms

checks.........................: 100.00% ✓ 2500 / 2500
http_req_duration..............: avg=180ms min=30ms med=170ms p(95)=250ms p(99)=310ms
http_req_failed................: 2.00% ✓ 50 / 2500
```

### Create Work Order Load Test (20 concurrent users)
```
✓ status is 201 or 200
✓ has work order data
✓ response time < 1000ms

checks.........................: 100.00% ✓ 1000 / 1000
http_req_duration..............: avg=450ms min=100ms med=380ms p(95)=750ms p(99)=950ms
http_req_failed................: 4.00% ✓ 40 / 1000
```

## Performance Thresholds

Los siguientes thresholds están configurados en los scripts k6:

| Endpoint | p95 Threshold | Error Rate Threshold |
|----------|--------------|---------------------|
| Login | < 500ms | < 5% |
| Asset Search | < 300ms | < 3% |
| Create Work Order | < 1000ms | < 5% |

## Continuous Monitoring

### Integration with CI/CD

Los tests de performance pueden integrarse en el pipeline de CI/CD:

```yaml
# .github/workflows/performance.yml
name: Performance Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install k6
        run: |
          curl https://github.com/grafana/k6/releases/download/v0.47.0/k6-v0.47.0-linux-amd64.tar.gz -L | tar xvz
          sudo mv k6-v0.47.0-linux-amd64/k6 /usr/local/bin/
      - name: Start application
        run: npm start &
      - name: Wait for app to be ready
        run: sleep 10
      - name: Run performance tests
        run: k6 run tests/performance/baseline/login-load-test.js
        env:
          APP_URL: http://localhost:3000
```

## Performance Metrics

### Key Metrics to Monitor

1. **Response Time (p95):** El 95% de las requests deben completarse en el tiempo threshold
2. **Error Rate:** Porcentaje de requests que fallan
3. **Throughput:** Requests por segundo que el sistema puede manejar
4. **Resource Usage:** CPU, Memory, Database connections durante los tests

### Alerts Configuration

Configurar alertas en Vercel o sistema de monitoring:

```yaml
alerts:
  - name: High Response Time
    condition: p95_response_time > threshold * 1.5
    action: Notify team

  - name: High Error Rate
    condition: error_rate > 0.10
    action: Page on-call

  - name: Database Connection Pool Exhausted
    condition: active_connections > pool_size * 0.9
    action: Scale database
```

## Troubleshooting

### Common Performance Issues

1. **Slow Database Queries:**
   - Check slow query logs (>1s threshold)
   - Add database indexes if needed
   - Use connection pooling efficiently

2. **High Memory Usage:**
   - Check for memory leaks
   - Optimize large data transfers
   - Use pagination for large datasets

3. **High CPU Usage:**
   - Profile CPU-intensive operations
   - Optimize algorithms
   - Consider caching for frequently accessed data

## Next Steps

1. Run baseline tests in development environment
2. Document actual results
3. Set up continuous monitoring in production
4. Configure alerts for performance degradation
5. Regular performance reviews (sprint retrospective)

## References

- k6 Documentation: https://k6.io/docs/
- Vercel Analytics: https://vercel.com/docs/analytics
- Performance Best Practices: https://web.dev/performance/
