const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PROMETHEUS_PORT || 9464;

// Fonction pour parser les résultats Allure
function parseAllureResults() {
  const resultsDir = path.join(__dirname, '..', 'allure-results');
  
  if (!fs.existsSync(resultsDir)) {
    return {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      avgDuration: 0
    };
  }

  const files = fs.readdirSync(resultsDir)
    .filter(f => f.endsWith('-result.json'));

  let total = 0;
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let totalDuration = 0;

  files.forEach(file => {
    try {
      const content = fs.readFileSync(path.join(resultsDir, file), 'utf8');
      const result = JSON.parse(content);
      
      total++;
      
      if (result.status === 'passed') {
        passed++;
      } else if (result.status === 'failed') {
        failed++;
      } else if (result.status === 'skipped') {
        skipped++;
      }
      
      if (result.stop && result.start) {
        totalDuration += (result.stop - result.start);
      }
    } catch (error) {
      console.error(`Error parsing ${file}:`, error.message);
    }
  });

  const avgDuration = total > 0 ? totalDuration / total : 0;

  return {
    total,
    passed,
    failed,
    skipped,
    avgDuration: Math.round(avgDuration)
  };
}

// Endpoint pour Prometheus
app.get('/metrics', (req, res) => {
  const metrics = parseAllureResults();
  
  // Format Prometheus
  const prometheusMetrics = `# HELP tests_total Total number of tests executed
# TYPE tests_total gauge
tests_total ${metrics.total}

# HELP tests_passed Number of tests that passed
# TYPE tests_passed gauge
tests_passed ${metrics.passed}

# HELP tests_failed Number of tests that failed
# TYPE tests_failed gauge
tests_failed ${metrics.failed}

# HELP tests_skipped Number of tests that were skipped
# TYPE tests_skipped gauge
tests_skipped ${metrics.skipped}

# HELP tests_avg_duration_ms Average test execution duration in milliseconds
# TYPE tests_avg_duration_ms gauge
tests_avg_duration_ms ${metrics.avgDuration}
`;

  res.set('Content-Type', 'text/plain');
  res.send(prometheusMetrics);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`📊 Prometheus exporter running on http://localhost:${PORT}/metrics`);
  console.log(`💚 Health check available at http://localhost:${PORT}/health`);
  console.log(`🔄 Metrics will update when tests are run`);
});

module.exports = app;
