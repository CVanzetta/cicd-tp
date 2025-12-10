/**
 * Tests conçus pour déclencher les alertes Grafana
 * 
 * Ces tests sont destinés à tester le système d'alertes :
 * - Tests en échec
 * - Tests sautés  
 * - Tests lents (pour augmenter le temps moyen)
 */

describe('Alarm Tests - Failures', () => {
  it('should fail intentionally to trigger failure alert', () => {
    expect(1 + 1).toBe(3); // ❌ Échec volontaire
  });

  it('should fail with error to trigger failure alert', () => {
    throw new Error('Intentional error for testing alerts'); // ❌ Erreur volontaire
  });
});

describe('Alarm Tests - Skipped', () => {
  it.skip('should be skipped to trigger skip alert', () => {
    // Ce test est sauté volontairement
    expect(true).toBe(true);
  });

  it.skip('another skipped test for alert testing', () => {
    // Autre test sauté
    expect(false).toBe(false);
  });
});

describe('Alarm Tests - Slow Execution', () => {
  it('should take long time to execute', async () => {
    // Test lent pour augmenter le temps moyen d'exécution de +30%
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 secondes
    expect(true).toBe(true);
  });

  it('another slow test', async () => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 secondes
    expect(true).toBe(true);
  });

  it('very slow test', async () => {
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 secondes
    expect(true).toBe(true);
  });
});
