# TP CI/CD

A Node.js application providing a simple greeting service with a REST API. It includes a server built with Express, greeting logic, and comprehensive test
suites (unit, integration, and end-to-end).

## Features

- **Greeting Functionality**: Generates personalized greetings via `src/greeting.js`.
- **REST API Server**: Built with Express in `src/server.js`, supporting GET and POST endpoints for greetings.
- **Testing**: Full test coverage with Jest:
  - Unit tests in `tests/unit/greeting.test.js`.
  - Integration tests in `tests/integration/app.test.js`.
  - End-to-end tests in `tests/e2e/e2e.test.js`.
- **Monitoring & Observability**:
  - Prometheus metrics exporter for test results
  - Grafana dashboards for visualization
  - Automated alerting system
- **Linting**: Configured with ESLint (via `.eslintrc.js` and `.eslintignore`).
- **Node.js Version Management**: Uses `.nvmrc` to specify Node.js v22.19.0.

## Prerequisites

- Node.js ≥22.19.0 (use `.nvmrc` with nvm: `nvm use`).
- npm (included with Node.js).

## Installation

1. Fork the repository:
2. Install dependencies:

```
npm install
```

## Usage

Start the server:

```
npm start
```

The server runs on port 3000 (or `process.env.PORT`). Endpoints:

- `GET /hello/:name?`: Returns a greeting (e.g., "Hello world!" or "Hello world! From [name]").
- `POST /hello`: Expects `x-name` header for the name.

## Testing

Run tests with Jest:

- All tests: `npm test`
- With coverage and Allure: `npm run test:allure`
- Trigger alarm tests: `npm run test:trigger-alarm`
- Unit tests: `npm test -- tests/unit/`
- Integration tests: `npm test -- tests/integration/`
- E2E tests: `npm test -- tests/e2e/`

### Allure Reports

This project uses Allure for test reporting:

- Test results are automatically generated in `allure-results/` during test execution
- Coverage reports are generated in `coverage/`
- In CI/CD: Allure reports are published to GitHub Pages on merge to master
- View the latest report: `https://[your-username].github.io/cicd-tp/allure-report/`

## Monitoring & Observability

This project includes a complete monitoring stack with Prometheus and Grafana:

### Quick Start

See **[DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md)** for a quick guide.

### Prometheus Exporter

Export test metrics to Prometheus:

```bash
npm run exporter
```

This starts a metrics server on http://localhost:9464/metrics exposing:
- `tests_total` - Total number of tests executed
- `tests_passed` - Number of tests that passed
- `tests_failed` - Number of tests that failed
- `tests_skipped` - Number of tests that were skipped
- `tests_avg_duration_ms` - Average test execution duration

### Grafana Dashboard

1. Install Grafana: https://grafana.com/grafana/download
2. Start Grafana (default: http://localhost:3000)
3. Add Prometheus data source: http://localhost:9090
4. Import the dashboard from `grafana-dashboard.json` or create manually

See **[GRAFANA_DASHBOARD.md](./GRAFANA_DASHBOARD.md)** for detailed instructions.

### Alerting

Configure alerts in Grafana for:
- Tests skipped > 0
- Tests failed > 0
- Test execution time increased by 30%

See **[GRAFANA_ALERTS.md](./GRAFANA_ALERTS.md)** for detailed instructions.

### Complete TP Guide

For the full Prometheus + Grafana TP, see:
- **[PROMETHEUS_GRAFANA_TP.md](./PROMETHEUS_GRAFANA_TP.md)** - Complete guide
- **[PROMETHEUS_QUERIES.md](./PROMETHEUS_QUERIES.md)** - PromQL query examples
- **[TP_RECAPITULATIF.md](./TP_RECAPITULATIF.md)** - Summary and checklist

## Linting

Check code quality:

```
npm run lint
```

## Project Structure

- `src/greeting.js`: Core greeting logic.
- `src/server.js`: Express server setup.
- `tests/`: Test suites (unit, integration, e2e).
- `.eslintrc.js`: ESLint configuration.
- `.eslintignore`: Files/directories excluded from linting.
- `.nvmrc`: Node.js version specification.
- `package.json`: Project metadata, dependencies, and scripts.

## Dependencies

- **Runtime**: Express (web server), Axios (HTTP client), Supertest (testing utility).
- **Dev**: ESLint (linting), Jest (testing).

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration:

- **On Pull Requests**:
  - Runs linting and all tests
  - Generates Allure test results and coverage
  - Posts automated comment with test results and coverage summary
  - Uploads artifacts (allure-results, coverage)

- **On Merge to Master**:
  - Runs full pipeline
  - Generates complete Allure report
  - Publishes report to GitHub Pages
  - Archives artifacts

### GitHub Pages Setup

To enable Allure report publishing:

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `root`
4. Save

Reports will be available at: `https://[your-username].github.io/cicd-tp/allure-report/`

## Contributing

1. Fork the repo.
2. Create a feature branch.
3. Run tests and linting.
4. Submit a pull request.
5. Check automated PR comment for test results.
