# Cloudflare Tunnels - Deep Dive

## Vue d'ensemble

**Cloudflare Tunnels** (anciennement Argo Tunnels) est un service gratuit de Cloudflare qui permet d'exposer un service local sur Internet sans ouvrir de ports sur le pare-feu. Il fonctionne en établissant une connexion sortante chiffrée depuis votre machine vers le réseau edge de Cloudflare.

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌────────────┐
│  Utilisateur │────▶│  Cloudflare Edge  │◀────│ cloudflared│
│  (Internet)  │     │  (CDN mondial)    │     │ (conteneur)│
└─────────────┘     └──────────────────┘     └──────┬─────┘
                                                     │
                                              ┌──────▼─────┐
                                              │  localhost  │
                                              │   :3000     │
                                              └────────────┘
```

### Flux de données

1. L'utilisateur accède à `https://app.votre-domaine.com`
2. La requête arrive sur le réseau edge de Cloudflare
3. Cloudflare la transmet via le tunnel chiffré à `cloudflared`
4. `cloudflared` la forward à `localhost:3000`
5. La réponse fait le chemin inverse

## Fonctionnement technique

### Le daemon `cloudflared`

`cloudflared` est le client qui :
- Établit des connexions **QUIC** ou **HTTP/2** vers le edge Cloudflare
- Maintient plusieurs connexions pour la redondance
- Gère le multiplexage des requêtes
- Ne nécessite **aucun port entrant** ouvert

### Types de tunnels

| Type | Description | Usage |
|------|-------------|-------|
| **Named Tunnels** | Tunnel persistant avec UUID | Production, DevContainers |
| **Quick Tunnels** | URL temporaire `*.trycloudflare.com` | Tests rapides, démos |

#### Quick Tunnel (sans configuration)

```bash
cloudflared tunnel --url http://localhost:3000
```

Génère instantanément une URL publique temporaire. Idéal pour un test rapide.

#### Named Tunnel (persistant)

```bash
cloudflared tunnel create mon-tunnel
cloudflared tunnel route dns mon-tunnel app.mondomaine.com
cloudflared tunnel run mon-tunnel
```

## Avantages

### Sécurité
- **Pas de ports ouverts** : Toutes les connexions sont sortantes
- **Protection DDoS** : Le réseau Cloudflare absorbe les attaques
- **Certificats TLS automatiques** : HTTPS gratuit et automatique
- **Zero Trust** : Possibilité d'ajouter une authentification (Cloudflare Access)

### Performance
- **CDN intégré** : Les assets statiques peuvent être mis en cache
- **Réseau Anycast** : Routage vers le data center le plus proche
- **Protocol QUIC** : Latence réduite par rapport à TCP

### Praticité
- **Domaine personnalisé** : Utilisation de votre propre domaine
- **Multi-services** : Un tunnel peut router vers plusieurs services via les règles d'ingress
- **Dashboard** : Interface web pour gérer les tunnels

## Limites

- **Dépendance à Cloudflare** : Le domaine doit être géré par Cloudflare (nameservers)
- **Latence ajoutée** : Le trafic passe par le edge Cloudflare (~10-50ms supplémentaires)
- **Pas d'accès réseau direct** : Uniquement du reverse proxy HTTP/TCP/UDP
- **Complexité pour le multi-port** : Nécessite une configuration d'ingress rules

## Configuration dans un DevContainer

### Dockerfile

```dockerfile
FROM node:20-bookworm

RUN curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb \
    -o /tmp/cloudflared.deb \
    && dpkg -i /tmp/cloudflared.deb \
    && rm /tmp/cloudflared.deb
```

### Configuration d'ingress (`config.yml`)

```yaml
tunnel: MON-TUNNEL-ID
credentials-file: /root/.cloudflared/MON-TUNNEL-ID.json

ingress:
  # Application principale
  - hostname: app.mondomaine.com
    service: http://localhost:3000

  # API séparée (exemple multi-service)
  - hostname: api.mondomaine.com
    service: http://localhost:4000

  # Catch-all obligatoire
  - service: http_status:404
```

## Coût

| Fonctionnalité | Prix |
|----------------|------|
| Cloudflare Tunnels | **Gratuit** |
| Cloudflare Access (50 users) | **Gratuit** |
| Cloudflare Access (> 50 users) | Payant |
| Domaine sur Cloudflare | Gratuit (nameservers) |

## Cas d'usage idéaux

- Exposer un DevContainer sur Internet pour des démos
- Recevoir des webhooks en développement
- Partager un prototype avec un client
- Environnement de staging rapide

---

> **Voir aussi** : [03-tailscale.md](03-tailscale.md) | [04-comparatif.md](04-comparatif.md)
