# DevContainers + Cloudflare Tunnels vs Tailscale

## Comparatif académique de solutions de tunneling pour DevContainers

### Problématique

Les **DevContainers** offrent des environnements de développement reproductibles et isolés, mais posent un défi majeur : **comment rendre accessible un service en cours de développement** à des collaborateurs distants ou sur Internet ?

Ce projet compare deux solutions populaires :

| | Cloudflare Tunnels | Tailscale |
|---|---|---|
| **Approche** | Reverse proxy via le réseau Cloudflare | Réseau mesh WireGuard P2P |
| **Accès** | Public (Internet) | Privé (+ Funnel pour public) |
| **Latence** | +10-50ms | ~1ms |

### Structure du projet

```
.
├── README.md                          ← Vous êtes ici
├── docs/
│   ├── 01-devcontainers.md            # Introduction aux DevContainers
│   ├── 02-cloudflare-tunnels.md       # Deep-dive Cloudflare
│   ├── 03-tailscale.md                # Deep-dive Tailscale
│   ├── 04-comparatif.md               # Tableau comparatif (14 critères)
│   └── 05-recommandations.md          # Arbre de décision
├── demo-app/                          # Application de démonstration
│   ├── package.json
│   ├── server.js                      # Express.js (GET /api/hello + page HTML)
│   └── Dockerfile
├── cloudflare-tunnel/                 # Setup DevContainer avec Cloudflare
│   ├── .devcontainer/
│   │   ├── devcontainer.json
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   ├── config.yml.example
│   └── README.md                      # Guide pas-à-pas
├── tailscale/                         # Setup DevContainer avec Tailscale
│   ├── .devcontainer/
│   │   ├── devcontainer.json
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   ├── tailscale.env.example
│   └── README.md                      # Guide pas-à-pas
└── benchmarks/                        # Scripts et résultats de tests
    ├── latency-test.sh
    ├── throughput-test.sh
    └── results/
        └── exemple-resultats.md
```

### Démarrage rapide

#### 1. Lancer l'application de démo

```bash
cd demo-app
npm install
npm start
# → http://localhost:3000
```

#### 2. Tester avec Cloudflare Tunnels

Suivez le guide dans [`cloudflare-tunnel/README.md`](cloudflare-tunnel/README.md).

En résumé :
```bash
# Quick tunnel (sans configuration)
cloudflared tunnel --url http://localhost:3000
```

#### 3. Tester avec Tailscale

Suivez le guide dans [`tailscale/README.md`](tailscale/README.md).

En résumé :
```bash
tailscale up --hostname=devcontainer-demo
# Accès via http://100.x.x.x:3000
```

### Documentation

| Document | Contenu |
|----------|---------|
| [01 - DevContainers](docs/01-devcontainers.md) | Qu'est-ce qu'un DevContainer, pourquoi les utiliser |
| [02 - Cloudflare Tunnels](docs/02-cloudflare-tunnels.md) | Architecture, fonctionnement, avantages et limites |
| [03 - Tailscale](docs/03-tailscale.md) | WireGuard, réseau mesh, Funnel |
| [04 - Comparatif](docs/04-comparatif.md) | Tableau détaillé sur 14 critères |
| [05 - Recommandations](docs/05-recommandations.md) | Arbre de décision : quand utiliser quoi |

### Conclusion

| Besoin | Solution recommandée |
|--------|---------------------|
| **Accès public** (démos, webhooks) | Cloudflare Tunnels |
| **Accès équipe** (collaboration, SSH) | Tailscale |
| **Les deux** | Cloudflare pour le public + Tailscale pour l'interne |

Les deux solutions sont **gratuites** pour un usage individuel/petit projet et s'intègrent bien dans un workflow DevContainer. Le choix dépend principalement du **type d'accès requis** et du **niveau de complexité acceptable** dans la configuration Docker.

---

*Projet académique — Comparatif DevContainers + Tunneling*
