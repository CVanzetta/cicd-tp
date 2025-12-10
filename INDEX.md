# 📚 INDEX - Documentation TP CI/CD

## 🎯 Navigation Rapide

### ⭐ Par où commencer ?

1. **Nouveau avec le TP ?** → [DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md)
2. **Besoin d'un guide complet ?** → [PROMETHEUS_GRAFANA_TP.md](./PROMETHEUS_GRAFANA_TP.md)
3. **Juste les commandes ?** → [COMMANDES.md](./COMMANDES.md)
4. **Vérifier l'installation ?** → [TESTS_VALIDATION.md](./TESTS_VALIDATION.md)

---

## 📖 Documentation Complète

### 🚀 Démarrage

| Fichier | Description | Temps de lecture | Niveau |
|---------|-------------|------------------|--------|
| **[DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md)** | Guide de démarrage rapide | 10 min | ⭐ Débutant |
| **[QUICKSTART.md](./QUICKSTART.md)** | Quick start (ancien Allure) | 5 min | Débutant |
| **[README.md](./README.md)** | Vue d'ensemble du projet | 5 min | Débutant |

### 📊 Monitoring & Observabilité

| Fichier | Description | Temps de lecture | Niveau |
|---------|-------------|------------------|--------|
| **[PROMETHEUS_GRAFANA_TP.md](./PROMETHEUS_GRAFANA_TP.md)** | Guide complet du TP | 30 min | ⭐ Recommandé |
| **[GRAFANA_DASHBOARD.md](./GRAFANA_DASHBOARD.md)** | Création du dashboard Grafana | 20 min | Intermédiaire |
| **[GRAFANA_ALERTS.md](./GRAFANA_ALERTS.md)** | Configuration des alertes | 25 min | Intermédiaire |
| **[PROMETHEUS_QUERIES.md](./PROMETHEUS_QUERIES.md)** | Collection de requêtes PromQL | 15 min | Intermédiaire |

### 🧪 Tests & Validation

| Fichier | Description | Temps de lecture | Niveau |
|---------|-------------|------------------|--------|
| **[TESTS_VALIDATION.md](./TESTS_VALIDATION.md)** | Scripts de validation complets | 20 min | Avancé |
| **[VALIDATION_CHECKLIST.md](./VALIDATION_CHECKLIST.md)** | Checklist de validation (Allure) | 10 min | Intermédiaire |

### 📝 Référence

| Fichier | Description | Temps de lecture | Niveau |
|---------|-------------|------------------|--------|
| **[TP_RECAPITULATIF.md](./TP_RECAPITULATIF.md)** | Résumé complet du TP | 15 min | ⭐ Recommandé |
| **[COMMANDES.md](./COMMANDES.md)** | Commandes essentielles | 10 min | Tous niveaux |
| **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** | Résumé technique (Allure) | 10 min | Avancé |

### 📑 Rapports Allure (Mini-TP précédent)

| Fichier | Description | Temps de lecture | Niveau |
|---------|-------------|------------------|--------|
| **[ALLURE.md](./ALLURE.md)** | Guide Allure reporting | 15 min | Intermédiaire |

---

## 🎓 Parcours d'Apprentissage Recommandés

### Parcours 1 : Démarrage Rapide (30 minutes)

1. [DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md) - Vue d'ensemble
2. [COMMANDES.md](./COMMANDES.md) - Commandes de base
3. [TESTS_VALIDATION.md](./TESTS_VALIDATION.md) - Vérifier l'installation
4. Lancer l'exporteur et les tests

### Parcours 2 : Configuration Complète (2 heures)

1. [DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md) - Préparation
2. [PROMETHEUS_GRAFANA_TP.md](./PROMETHEUS_GRAFANA_TP.md) - Installation et configuration
3. [GRAFANA_DASHBOARD.md](./GRAFANA_DASHBOARD.md) - Créer le dashboard
4. [GRAFANA_ALERTS.md](./GRAFANA_ALERTS.md) - Configurer les alertes
5. [TESTS_VALIDATION.md](./TESTS_VALIDATION.md) - Valider la configuration

### Parcours 3 : Maîtrise Avancée (4 heures)

1. Tout le Parcours 2
2. [PROMETHEUS_QUERIES.md](./PROMETHEUS_QUERIES.md) - Maîtriser PromQL
3. [TP_RECAPITULATIF.md](./TP_RECAPITULATIF.md) - Architecture complète
4. Personnaliser le dashboard
5. Créer des alertes avancées
6. Intégrer dans CI/CD

---

## 🔍 Recherche par Besoin

### "Je veux..."

#### Installer et démarrer
→ [DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md)

#### Comprendre l'architecture
→ [TP_RECAPITULATIF.md](./TP_RECAPITULATIF.md)

#### Créer le dashboard Grafana
→ [GRAFANA_DASHBOARD.md](./GRAFANA_DASHBOARD.md)

#### Configurer les alertes
→ [GRAFANA_ALERTS.md](./GRAFANA_ALERTS.md)

#### Écrire des requêtes PromQL
→ [PROMETHEUS_QUERIES.md](./PROMETHEUS_QUERIES.md)

#### Tester mon installation
→ [TESTS_VALIDATION.md](./TESTS_VALIDATION.md)

#### Voir toutes les commandes
→ [COMMANDES.md](./COMMANDES.md)

#### Troubleshooting
→ [PROMETHEUS_GRAFANA_TP.md](./PROMETHEUS_GRAFANA_TP.md) (section Troubleshooting)

#### Comprendre les métriques
→ [TP_RECAPITULATIF.md](./TP_RECAPITULATIF.md) (section Métriques Exposées)

---

## 📁 Fichiers de Configuration

| Fichier | Description |
|---------|-------------|
| `package.json` | Scripts npm et dépendances |
| `prometheus.yml` | Configuration Prometheus |
| `grafana-dashboard.json` | Template dashboard Grafana |
| `jest.config.js` | Configuration Jest + Allure |
| `src/prometheusExporter.js` | Exporteur de métriques |
| `tests/alarm/alarm.test.js` | Tests pour déclencher les alertes |

---

## 🎯 Objectifs du TP

### Obligatoires

- [ ] Rapports Allure générés
- [ ] Métriques Prometheus collectées
- [ ] Dashboard Grafana créé (5 panels)
- [ ] Alertes Grafana configurées (3 alertes)
- [ ] Tests d'alarme fonctionnels

### Recommandés

- [ ] Prometheus installé et fonctionnel
- [ ] Grafana installé et fonctionnel
- [ ] Dashboard avec tous les panels
- [ ] Toutes les alertes testées

### Bonus

- [ ] Notifications configurées (Slack/Discord)
- [ ] Dashboard personnalisé
- [ ] Métriques additionnelles
- [ ] Intégration CI/CD

---

## 📊 Métriques Disponibles

| Métrique | Description | Type |
|----------|-------------|------|
| `tests_total` | Nombre total de tests | gauge |
| `tests_passed` | Tests réussis | gauge |
| `tests_failed` | Tests échoués | gauge |
| `tests_skipped` | Tests sautés | gauge |
| `tests_avg_duration_ms` | Temps moyen (ms) | gauge |

---

## 🔗 Liens Utiles

### Services Locaux

- **Exporteur Prometheus** : http://localhost:9464/metrics
- **Health Check** : http://localhost:9464/health
- **Prometheus** : http://localhost:9090
- **Grafana** : http://localhost:3000

### Documentation Externe

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [PromQL Cheat Sheet](https://promlabs.com/promql-cheat-sheet/)
- [Allure Framework](https://docs.qameta.io/allure/)

---

## 🆘 Aide Rapide

### Problème avec...

**L'exporteur Prometheus** :
- Voir [TESTS_VALIDATION.md](./TESTS_VALIDATION.md) section "Troubleshooting"
- Vérifier que le port 9464 est libre
- Relancer : `npm run exporter`

**Prometheus** :
- Voir [PROMETHEUS_GRAFANA_TP.md](./PROMETHEUS_GRAFANA_TP.md) section "Troubleshooting"
- Vérifier `prometheus.yml`
- Vérifier la target sur http://localhost:9090/targets

**Grafana** :
- Voir [GRAFANA_DASHBOARD.md](./GRAFANA_DASHBOARD.md) section "Troubleshooting"
- Vérifier la data source
- Tester les queries dans Prometheus d'abord

**Les tests** :
- Voir [TESTS_VALIDATION.md](./TESTS_VALIDATION.md)
- Les tests d'alarme échouent volontairement
- Exclure avec : `npm test -- --testPathIgnorePatterns=alarm`

**Les alertes** :
- Voir [GRAFANA_ALERTS.md](./GRAFANA_ALERTS.md) section "Troubleshooting"
- Vérifier les queries PromQL
- Vérifier les seuils (thresholds)
- Attendre le délai d'évaluation (10s)

---

## 📈 Progression Suggérée

### Étape 1 : Installation (15 min)
- [ ] Lire [DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md)
- [ ] Installer Prometheus et Grafana
- [ ] Lancer l'exporteur : `npm run exporter`

### Étape 2 : Vérification (10 min)
- [ ] Suivre [TESTS_VALIDATION.md](./TESTS_VALIDATION.md)
- [ ] Exécuter `npm test`
- [ ] Vérifier les métriques

### Étape 3 : Configuration Prometheus (15 min)
- [ ] Lancer Prometheus
- [ ] Vérifier les targets
- [ ] Tester les queries

### Étape 4 : Dashboard Grafana (30 min)
- [ ] Suivre [GRAFANA_DASHBOARD.md](./GRAFANA_DASHBOARD.md)
- [ ] Créer les 5 panels
- [ ] Sauvegarder le dashboard

### Étape 5 : Alertes (30 min)
- [ ] Suivre [GRAFANA_ALERTS.md](./GRAFANA_ALERTS.md)
- [ ] Créer les 3 alertes
- [ ] Tester avec `npm run test:trigger-alarm`

### Étape 6 : Validation (15 min)
- [ ] Consulter [TP_RECAPITULATIF.md](./TP_RECAPITULATIF.md)
- [ ] Vérifier la checklist
- [ ] Préparer la démo

---

## 🎨 Structure du Projet

```
cicd-tp/
├── 📚 Documentation
│   ├── INDEX.md (ce fichier)
│   ├── DEMARRAGE_RAPIDE.md ⭐
│   ├── PROMETHEUS_GRAFANA_TP.md ⭐
│   ├── GRAFANA_DASHBOARD.md
│   ├── GRAFANA_ALERTS.md
│   ├── PROMETHEUS_QUERIES.md
│   ├── TESTS_VALIDATION.md
│   ├── TP_RECAPITULATIF.md ⭐
│   ├── COMMANDES.md
│   └── README.md
│
├── ⚙️ Configuration
│   ├── prometheus.yml
│   ├── grafana-dashboard.json
│   ├── jest.config.js
│   └── package.json
│
├── 🔧 Source
│   ├── src/
│   │   ├── prometheusExporter.js
│   │   ├── server.js
│   │   └── greeting.js
│   └── tests/
│       ├── alarm/
│       ├── unit/
│       ├── integration/
│       └── e2e/
│
└── 📊 Résultats
    ├── allure-results/
    └── coverage/
```

---

## 🏆 Critères de Réussite

### Minimum Viable

✅ Exporteur Prometheus fonctionnel
✅ Tests s'exécutent et génèrent des métriques
✅ Métriques accessibles sur port 9464

### Configuration Complète

✅ Minimum Viable +
✅ Prometheus scrape les métriques
✅ Dashboard Grafana avec 5 panels
✅ 3 alertes configurées

### Excellence

✅ Configuration Complète +
✅ Alertes se déclenchent correctement
✅ Notifications configurées
✅ Dashboard personnalisé
✅ Documentation comprise

---

## 💡 Conseils

### Pour Apprendre Efficacement

1. **Suivez l'ordre** : Commencez par [DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md)
2. **Pratiquez** : Lancez chaque commande vous-même
3. **Testez** : Utilisez [TESTS_VALIDATION.md](./TESTS_VALIDATION.md)
4. **Comprenez** : Lisez [TP_RECAPITULATIF.md](./TP_RECAPITULATIF.md)

### Pour Réussir le TP

1. **Installation propre** : Vérifiez chaque service
2. **Testez progressivement** : Un service à la fois
3. **Consultez les logs** : En cas d'erreur
4. **Utilisez les troubleshooting** : Dans chaque guide

### Pour Aller Plus Loin

1. Personnalisez le dashboard
2. Ajoutez vos propres métriques
3. Créez des alertes avancées
4. Intégrez dans votre CI/CD

---

## 📞 Support

### Où trouver de l'aide ?

1. **Dans la documentation** : Sections Troubleshooting
2. **Dans les exemples** : [COMMANDES.md](./COMMANDES.md)
3. **Dans les tests** : [TESTS_VALIDATION.md](./TESTS_VALIDATION.md)
4. **Documentation officielle** : Liens en bas de page

### Checklist de Debug

- [ ] Lire la section Troubleshooting du guide concerné
- [ ] Vérifier que tous les services tournent
- [ ] Tester les commandes de base
- [ ] Vérifier les logs des services
- [ ] Consulter les exemples dans [COMMANDES.md](./COMMANDES.md)

---

## 🎉 Félicitations !

Vous avez maintenant accès à une documentation complète pour maîtriser le monitoring avec Prometheus et Grafana.

**Prochaine étape :** Ouvrir [DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md) et commencer le TP !

---

**📚 Bookmark ce fichier : [INDEX.md](./INDEX.md)**

*Dernière mise à jour : 10 décembre 2025*
