# Allure Test Reporting Configuration

## Overview

This project uses Allure Framework for comprehensive test reporting. Allure generates beautiful HTML reports from Jest test results.

## Local Setup

### Prerequisites

- Node.js ≥22.19.0
- Java (for Allure CLI) - optional, only needed to view reports locally

### Generate Test Results

```bash
# Run tests and generate Allure results
npm run test:allure
```

This creates `allure-results/` directory with test execution data.

### View Reports Locally (Optional)

Install Allure CLI:

```bash
# Via npm
npm install -g allure-commandline

# Or via Homebrew (macOS)
brew install allure
```

Generate and open the report:

```bash
# Generate HTML report from results
allure generate allure-results --clean -o allure-report

# Open the report in browser
allure open allure-report
```

## CI/CD Integration

### Pull Request Workflow

When you open a PR:

1. **Tests Run**: All Jest tests execute with Allure reporter
2. **Artifacts Upload**: 
   - `allure-results/` - Raw test data
   - `coverage/` - Code coverage reports
3. **PR Comment**: Bot posts test results summary with:
   - Pass/fail status
   - Coverage percentages
   - Links to download artifacts
   - Commit SHA and timestamp
4. **Comment Updates**: Updates on each new commit to the PR

### Master Branch Workflow

When merged to master:

1. **Full Pipeline**: All tests run as in PR
2. **Allure Report Generation**: 
   - Downloads test results
   - Generates complete HTML report
   - Maintains history of last 20 reports
3. **GitHub Pages Deployment**:
   - Publishes to `gh-pages` branch
   - Available at: `https://[username].github.io/cicd-tp/allure-report/`
4. **Artifact Archival**: Reports kept for 30 days

## Configuration Files

### `jest.config.js`

```javascript
reporters: [
  'default',
  'jest-allure2-reporter',
],
```

Configures Jest to output Allure-compatible results.

### `.github/workflows/ci.yml`

Key jobs:

- **test**: Runs tests, uploads artifacts
- **allure-report**: Generates report (master only)
- **pr-comment**: Posts results to PR

## Viewing Reports

### From GitHub Actions

1. Go to Actions tab
2. Select a workflow run
3. Scroll to Artifacts section
4. Download `allure-report` (master) or `allure-results` (PR)

### From GitHub Pages (Master only)

Visit: `https://[your-username].github.io/cicd-tp/allure-report/`

Features:
- Test execution trends
- Test duration graphs
- Failure history
- Test categorization
- Environment information

## Report Features

Allure reports include:

- ✅ **Overview**: Total tests, pass/fail rate, duration
- 📊 **Suites**: Test organization by file
- 📈 **Graphs**: Trends over time
- 🔍 **Categories**: Failures by type
- 📝 **Test Details**: Stack traces, timing
- 🏷️ **Tags**: Filter by test type (unit/integration/e2e)

## Troubleshooting

### No allure-results generated

- Check Jest config has `jest-allure2-reporter` in reporters
- Verify dependency installed: `npm list jest-allure2-reporter`
- Run with verbose: `npm test -- --verbose`

### GitHub Pages not updating

- Verify permissions in Settings → Actions → Workflow permissions
- Check `gh-pages` branch exists
- Review deployment logs in Actions

### PR comment not appearing

- Ensure workflow has `pull-requests: write` permission
- Check if issue/PR number is valid
- Review script logs in Actions

## Advanced Usage

### Adding Test Metadata

Enhance reports with Allure annotations in tests:

```javascript
describe('My Suite', () => {
  it('should do something', () => {
    // Test code
  });
});
```

The reporter automatically captures:
- Test name and description
- Suite hierarchy
- Execution time
- Status (passed/failed/skipped)
- Error stack traces

## Dependencies

- `jest-allure2-reporter`: ^2.x - Jest reporter for Allure
- `simple-elf/allure-report-action`: GitHub Action for report generation
- `peaceiris/actions-gh-pages`: GitHub Pages deployment

## Best Practices

1. **Run locally before pushing**: Catch issues early
2. **Check coverage thresholds**: Maintain high coverage
3. **Review report history**: Track trends
4. **Keep reports clean**: Fix flaky tests
5. **Archive important reports**: Download before 30-day expiry

## Resources

- [Allure Framework Docs](https://docs.qameta.io/allure/)
- [jest-allure2-reporter](https://github.com/ryparker/jest-allure2-reporter)
- [GitHub Actions Docs](https://docs.github.com/actions)
