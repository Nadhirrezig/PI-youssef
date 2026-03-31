# Résultats de benchmark - Exemple

> **Note** : Ces résultats sont des exemples simulés à des fins d'illustration. Les performances réelles dépendent de la localisation géographique, de la qualité du réseau et de la charge du serveur.

## Environnement de test

| Paramètre | Valeur |
|-----------|--------|
| Machine hôte | Ubuntu 22.04, 4 vCPU, 8 Go RAM |
| Application | Express.js (endpoint `/api/hello`) |
| Localisation serveur | Paris, France |
| Localisation client | Paris, France |
| Date | Mars 2026 |

## Test de latence (10 requêtes)

### Accès direct (localhost)

```
Requête  1 :  1.23 ms
Requête  2 :  0.98 ms
Requête  3 :  1.05 ms
Requête  4 :  1.12 ms
Requête  5 :  0.95 ms
Requête  6 :  1.18 ms
Requête  7 :  1.01 ms
Requête  8 :  0.99 ms
Requête  9 :  1.08 ms
Requête 10 :  1.03 ms

Moyenne : 1.06 ms
```

### Via Cloudflare Tunnel

```
Requête  1 : 28.45 ms
Requête  2 : 24.12 ms
Requête  3 : 25.67 ms
Requête  4 : 31.23 ms
Requête  5 : 23.89 ms
Requête  6 : 26.34 ms
Requête  7 : 27.91 ms
Requête  8 : 24.56 ms
Requête  9 : 29.08 ms
Requête 10 : 25.73 ms

Moyenne : 26.70 ms
```

### Via Tailscale (P2P direct)

```
Requête  1 :  4.23 ms
Requête  2 :  3.45 ms
Requête  3 :  3.89 ms
Requête  4 :  5.12 ms
Requête  5 :  3.67 ms
Requête  6 :  4.01 ms
Requête  7 :  3.78 ms
Requête  8 :  4.34 ms
Requête  9 :  3.92 ms
Requête 10 :  3.56 ms

Moyenne : 3.99 ms
```

## Test de débit (wrk, 10s, 10 connexions)

### Accès direct (localhost)

```
Running 10s test @ http://localhost:3000/api/hello
  2 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.12ms  256.34us   8.45ms   92.31%
    Req/Sec     4.52k   312.45     5.12k    78.22%
  89847 requests in 10.00s, 21.34MB read
Requests/sec:   8984.70
Transfer/sec:      2.13MB
```

### Via Cloudflare Tunnel

```
Running 10s test @ https://app.exemple.com/api/hello
  2 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    26.34ms    8.12ms  89.23ms   85.67%
    Req/Sec   195.23     42.56   310.00     72.34%
  3891 requests in 10.00s, 1.02MB read
Requests/sec:    389.10
Transfer/sec:    104.56KB
```

### Via Tailscale (P2P direct)

```
Running 10s test @ http://100.64.1.2:3000/api/hello
  2 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     3.89ms    1.23ms  15.67ms   88.45%
    Req/Sec     1.31k   198.34     1.78k    74.56%
  26089 requests in 10.00s, 6.19MB read
Requests/sec:   2608.90
Transfer/sec:    634.12KB
```

## Tableau récapitulatif

| Métrique | Direct | Cloudflare Tunnel | Tailscale (P2P) |
|----------|--------|-------------------|-----------------|
| **Latence moyenne** | 1.06 ms | 26.70 ms | 3.99 ms |
| **Latence max** | 1.23 ms | 31.23 ms | 5.12 ms |
| **Débit (req/s)** | 8 984 | 389 | 2 608 |
| **Surcharge vs direct** | — | +25.64 ms (+2 419%) | +2.93 ms (+276%) |

## Analyse

1. **Latence** : Tailscale est ~6.7x plus rapide que Cloudflare grâce à la connexion P2P directe
2. **Débit** : Tailscale offre ~6.7x plus de requêtes/seconde que Cloudflare
3. **Cloudflare** : La latence supplémentaire est due au passage par le réseau edge, mais reste acceptable pour du développement web
4. **Tailscale** : La surcharge par rapport à localhost est minimale (~3ms), grâce à WireGuard

> **Conclusion** : Pour des besoins de développement, les deux solutions offrent des performances acceptables. Tailscale est préférable si la latence est critique, Cloudflare est suffisant pour la majorité des cas d'usage web.
