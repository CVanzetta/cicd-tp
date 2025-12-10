# 📊 Exemples de Requêtes Prometheus (PromQL)

## Métriques de Base

### Voir toutes les métriques disponibles
```promql
{job="test-metrics"}
```

### Nombre total de tests
```promql
tests_total
```

### Tests passés
```promql
tests_passed
```

### Tests échoués
```promql
tests_failed
```

### Tests sautés
```promql
tests_skipped
```

### Temps moyen d'exécution
```promql
tests_avg_duration_ms
```

---

## Calculs et Agrégations

### Taux de réussite (%)
```promql
(tests_passed / tests_total) * 100
```

### Taux d'échec (%)
```promql
(tests_failed / tests_total) * 100
```

### Nombre de tests non-passés
```promql
tests_failed + tests_skipped
```

### Temps d'exécution en secondes
```promql
tests_avg_duration_ms / 1000
```

---

## Comparaisons Temporelles

### Variation du temps d'exécution (dernière minute)
```promql
tests_avg_duration_ms - tests_avg_duration_ms offset 1m
```

### Pourcentage d'augmentation du temps
```promql
((tests_avg_duration_ms - tests_avg_duration_ms offset 1m) / tests_avg_duration_ms offset 1m) * 100
```

### Nombre de tests ajoutés (depuis 5 min)
```promql
tests_total - tests_total offset 5m
```

---

## Fonctions PromQL Utiles

### Moyenne sur 5 minutes
```promql
avg_over_time(tests_avg_duration_ms[5m])
```

### Maximum sur 1 heure
```promql
max_over_time(tests_failed[1h])
```

### Minimum sur 1 heure
```promql
min_over_time(tests_avg_duration_ms[1h])
```

### Somme des échecs sur 1 heure
```promql
sum_over_time(tests_failed[1h])
```

### Taux de changement (dérivée)
```promql
deriv(tests_avg_duration_ms[5m])
```

### Prédiction linéaire (dans 30 min)
```promql
predict_linear(tests_avg_duration_ms[30m], 1800)
```

---

## Alertes PromQL

### Alerte : Tests échoués
```promql
tests_failed > 0
```

### Alerte : Tests sautés
```promql
tests_skipped > 0
```

### Alerte : Temps d'exécution élevé
```promql
tests_avg_duration_ms > 150
```

### Alerte : Augmentation de 30% du temps
```promql
((tests_avg_duration_ms - tests_avg_duration_ms offset 1m) / tests_avg_duration_ms offset 1m) * 100 > 30
```

### Alerte : Taux de réussite sous 90%
```promql
(tests_passed / tests_total) * 100 < 90
```

### Alerte : Plus de 5 tests échoués
```promql
tests_failed > 5
```

### Alerte : Aucun test depuis 10 minutes
```promql
time() - timestamp(tests_total) > 600
```

---

## Queries pour Graphiques Grafana

### Graphique multi-séries (états des tests)
```promql
# Query A (Legend: Passed)
tests_passed

# Query B (Legend: Failed)
tests_failed

# Query C (Legend: Skipped)
tests_skipped
```

### Graphique de tendance (temps d'exécution)
```promql
tests_avg_duration_ms
```

### Gauge (taux de réussite)
```promql
(tests_passed / tests_total) * 100
```

### Stat (total tests avec seuils)
```promql
tests_total
```
- Threshold vert : > 40
- Threshold orange : 20-40
- Threshold rouge : < 20

---

## Queries Avancées

### Delta absolu (changement depuis dernière mesure)
```promql
delta(tests_avg_duration_ms[1m])
```

### Increase (augmentation sur période)
```promql
increase(tests_failed[5m])
```

### Rate (taux par seconde)
```promql
rate(tests_total[5m])
```

### Changes (nombre de changements)
```promql
changes(tests_total[10m])
```

### Absent (détection métrique manquante)
```promql
absent(tests_total)
```

---

## Queries pour Dashboard Complet

### Panel 1 : Overview
```promql
# Total
tests_total

# Success rate
(tests_passed / tests_total) * 100
```

### Panel 2 : Test Status Distribution
```promql
# Stacked graph
tests_passed
tests_failed
tests_skipped
```

### Panel 3 : Performance Trend
```promql
# Line graph with prediction
tests_avg_duration_ms
predict_linear(tests_avg_duration_ms[30m], 1800)
```

### Panel 4 : Alert Status
```promql
# Count of failing conditions
(tests_failed > 0) + (tests_skipped > 0) + (tests_avg_duration_ms > 150)
```

---

## Filtres et Labels (si vous ajoutez des labels)

### Par type de test
```promql
tests_total{test_type="unit"}
tests_total{test_type="integration"}
tests_total{test_type="e2e"}
```

### Par environnement
```promql
tests_total{env="dev"}
tests_total{env="staging"}
tests_total{env="prod"}
```

### Avec regex
```promql
tests_total{test_type=~"unit|integration"}
```

---

## Opérateurs PromQL

### Arithmétiques
```promql
tests_passed + tests_failed + tests_skipped  # Addition
tests_total - tests_passed                   # Soustraction
tests_avg_duration_ms * 1.3                  # Multiplication
tests_avg_duration_ms / 1000                 # Division
```

### Comparaison
```promql
tests_failed > 0    # Supérieur
tests_passed >= 45  # Supérieur ou égal
tests_failed < 5    # Inférieur
tests_skipped <= 2  # Inférieur ou égal
tests_failed == 0   # Égal
tests_failed != 0   # Différent
```

### Logiques
```promql
tests_failed > 0 and tests_skipped > 0   # ET
tests_failed > 5 or tests_skipped > 5    # OU
tests_total unless tests_failed > 0      # Sauf si
```

---

## Exemples de Tableaux Grafana

### Table : Résumé des Tests
```promql
# Colonnes : Métrique, Valeur actuelle, Changement 5min

tests_total
tests_passed
tests_failed
tests_skipped
tests_avg_duration_ms
```

Transformation : `Outer join` sur toutes les queries

---

## Testing des Queries

### Dans Prometheus
1. Aller sur http://localhost:9090/graph
2. Coller la query dans le champ
3. Cliquer sur **Execute**
4. Voir les résultats dans **Table** ou **Graph**

### Dans Grafana
1. Dashboard → Edit panel
2. Onglet **Query**
3. Coller la query
4. **Query inspector** pour voir les données brutes

---

## Best Practices

### 1. Nommage clair
```promql
# Bon
(tests_passed / tests_total) * 100

# Avec alias (dans Grafana)
(tests_passed / tests_total) * 100
→ Alias: "Success Rate (%)"
```

### 2. Éviter les calculs trop fréquents
```promql
# Préférer
avg_over_time(tests_avg_duration_ms[5m])

# À la place de
tests_avg_duration_ms
```

### 3. Utiliser des ranges appropriés
```promql
# Pour alertes : range court
tests_failed[1m]

# Pour dashboards : range moyen
tests_avg_duration_ms[5m]

# Pour tendances : range long
tests_total[1h]
```

### 4. Ajouter des labels pour filtrer
```promql
tests_total{job="test-metrics", env="prod"}
```

---

## Queries pour CI/CD

### Détection de régression
```promql
# Temps actuel vs moyenne des 7 derniers jours
tests_avg_duration_ms > avg_over_time(tests_avg_duration_ms[7d]) * 1.2
```

### Stabilité des tests
```promql
# Nombre de changements d'état en 1h
changes(tests_failed[1h]) > 3
```

### Health Check
```promql
# Dernier scrape récent (< 30s)
time() - timestamp(tests_total) < 30
```

---

## Documentation PromQL

- **Opérateurs** : https://prometheus.io/docs/prometheus/latest/querying/operators/
- **Fonctions** : https://prometheus.io/docs/prometheus/latest/querying/functions/
- **Exemples** : https://prometheus.io/docs/prometheus/latest/querying/examples/

---

## 🎯 Queries à Tester Immédiatement

1. Copiez-collez dans Prometheus : http://localhost:9090/graph
2. Testez ces queries :

```promql
# Taux de réussite
(tests_passed / tests_total) * 100

# Temps moyen en secondes
tests_avg_duration_ms / 1000

# Variation depuis 1 minute
tests_avg_duration_ms - tests_avg_duration_ms offset 1m
```

3. Utilisez-les dans Grafana pour créer des panels !

---

**💡 Astuce :** Prometheus supporte l'autocomplétion. Tapez `tests_` et appuyez sur Tab pour voir toutes les métriques disponibles !
