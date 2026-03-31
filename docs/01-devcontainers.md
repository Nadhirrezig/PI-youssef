# Les DevContainers

## Qu'est-ce qu'un DevContainer ?

Un **Development Container** (DevContainer) est un conteneur Docker configuré spécifiquement pour servir d'environnement de développement complet. Standardisé par la [Dev Container Specification](https://containers.dev/), il permet de définir un environnement reproductible incluant le système d'exploitation, les outils, les dépendances et les configurations nécessaires au développement.

## Pourquoi utiliser des DevContainers ?

### Le problème classique

> « Ça marche sur ma machine ! »

Chaque développeur a un système différent (Windows, macOS, Linux), des versions d'outils différentes, des configurations locales spécifiques. Cela entraîne :

- Des bugs non reproductibles
- Du temps perdu en configuration
- Des conflits de dépendances
- Une intégration difficile des nouveaux membres de l'équipe

### La solution DevContainer

Le DevContainer encapsule **tout l'environnement** dans un conteneur :

```
┌─────────────────────────────────┐
│         VS Code / IDE           │
├─────────────────────────────────┤
│       DevContainer              │
│  ┌───────────────────────────┐  │
│  │  OS (ex: Debian/Ubuntu)   │  │
│  │  Runtime (Node, Python..) │  │
│  │  Outils (git, curl, jq)  │  │
│  │  Extensions VS Code       │  │
│  │  Configuration projet     │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

## Comment ça fonctionne ?

### Fichier `devcontainer.json`

C'est le fichier central de configuration, placé dans `.devcontainer/` :

```json
{
  "name": "Mon Projet",
  "build": {
    "dockerfile": "Dockerfile"
  },
  "forwardPorts": [3000],
  "postCreateCommand": "npm install",
  "customizations": {
    "vscode": {
      "extensions": ["dbaeumer.vscode-eslint"]
    }
  }
}
```

### Cycle de vie

1. **Build** : Docker construit l'image à partir du Dockerfile
2. **Create** : Le conteneur est créé, les volumes montés
3. **postCreateCommand** : Installation des dépendances
4. **postStartCommand** : Lancement des services
5. **Développement** : Le développeur travaille dans le conteneur

### Avec Docker Compose

Pour des configurations plus complexes (bases de données, services multiples), on utilise `docker-compose.yml` :

```json
{
  "dockerComposeFile": "docker-compose.yml",
  "service": "app",
  "workspaceFolder": "/workspace"
}
```

## Avantages clés

| Avantage | Description |
|----------|-------------|
| **Reproductibilité** | Même environnement pour tous les développeurs |
| **Isolation** | Pas de conflit avec le système hôte |
| **Rapidité d'onboarding** | Un nouveau développeur est opérationnel en minutes |
| **Versioning** | L'environnement est versionné avec le code |
| **CI/CD** | Le même conteneur peut être utilisé en CI |

## Limites

- **Performance** : Légère surcharge par rapport à un environnement natif
- **Ressources** : Docker consomme de la RAM et du CPU
- **Réseau** : L'accès réseau est limité au conteneur — c'est ici qu'interviennent les solutions de **tunneling**

## Le défi du tunneling

Par défaut, un DevContainer n'est accessible que depuis la machine hôte via le port forwarding. Mais comment :

- Partager un DevContainer avec un collègue distant ?
- Exposer un service en cours de développement sur Internet ?
- Tester des webhooks depuis un service externe ?

C'est précisément le problème que résolvent **Cloudflare Tunnels** et **Tailscale**, les deux solutions comparées dans ce projet.

---

> **Voir aussi** : [02-cloudflare-tunnels.md](02-cloudflare-tunnels.md) | [03-tailscale.md](03-tailscale.md)
