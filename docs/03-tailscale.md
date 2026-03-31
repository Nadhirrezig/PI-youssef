# Tailscale - Deep Dive

## Vue d'ensemble

**Tailscale** est un service de réseau mesh basé sur **WireGuard** qui crée un réseau privé virtuel (VPN) entre vos appareils. Chaque appareil reçoit une adresse IP stable en `100.x.x.x` et peut communiquer directement avec les autres, comme s'ils étaient sur le même réseau local.

## Architecture

```
┌─────────────────────────────────────────────┐
│              Tailnet (réseau mesh)           │
│                                             │
│  ┌──────────┐    WireGuard    ┌──────────┐  │
│  │  Laptop  │◀──────────────▶│DevContainer│ │
│  │100.64.1.1│                │100.64.1.2 │  │
│  └──────────┘                └──────────┘  │
│       ▲                           ▲         │
│       │         WireGuard         │         │
│       └───────────────────────────┘         │
│                    ▲                        │
│              ┌─────┴─────┐                  │
│              │  Serveur   │                  │
│              │100.64.1.3 │                  │
│              └───────────┘                  │
└─────────────────────────────────────────────┘

┌─────────────────┐
│ Coordination    │  (DERP relay si NAT traversal échoue)
│ Tailscale.com   │
└─────────────────┘
```

### Flux de données

1. Les appareils s'enregistrent auprès du serveur de coordination Tailscale
2. Les clés WireGuard sont échangées via le serveur de coordination
3. Les connexions sont établies **directement** entre les appareils (peer-to-peer)
4. Si le P2P échoue (NAT symétrique), le trafic passe par un relay DERP

## Fonctionnement technique

### WireGuard

Tailscale utilise **WireGuard** comme couche de chiffrement :
- Protocole moderne, rapide et audité
- Latence minimale (~1ms de surcharge)
- Chiffrement de niveau militaire (Curve25519, ChaCha20, Poly1305)
- Connexion stateless : reprise instantanée après une déconnexion

### MagicDNS

Chaque appareil est accessible par son nom :

```bash
# Au lieu de retenir 100.64.1.2
curl http://devcontainer-demo:3000/api/hello
```

### Tailscale Funnel

**Funnel** permet d'exposer un service Tailscale sur Internet public :

```bash
tailscale funnel 3000
# → https://devcontainer-demo.tailnet-xxxxx.ts.net/
```

C'est la fonctionnalité qui rend Tailscale comparable à Cloudflare Tunnels pour l'accès public.

## Avantages

### Réseau
- **Accès réseau complet** : Pas limité à HTTP, tous les protocoles fonctionnent (SSH, bases de données, etc.)
- **Connexion directe** : Peer-to-peer, pas de serveur intermédiaire (latence minimale)
- **IP stable** : Chaque appareil garde la même IP `100.x.x.x`
- **MagicDNS** : Résolution de noms automatique

### Sécurité
- **WireGuard** : Chiffrement de bout en bout
- **ACL granulaires** : Contrôle fin des accès par utilisateur, groupe et service
- **SSO** : Intégration avec Google, Microsoft, GitHub, Okta
- **Pas de ports ouverts** : Comme Cloudflare, toutes les connexions sont sortantes

### Simplicité
- **Installation rapide** : Un seul script d'installation
- **Auto-configuration** : La découverte du réseau est automatique
- **Pas de domaine requis** : Fonctionne avec les IPs Tailscale directement

## Limites

- **Pas de CDN** : Pas de mise en cache des assets
- **Pas de protection DDoS** : Le trafic arrive directement sur l'appareil
- **Accès public limité** : Funnel est en beta et a des restrictions
- **Conteneur Docker** : Nécessite `NET_ADMIN` et `/dev/net/tun`
- **Dépendance au serveur de coordination** : Si Tailscale.com est down, les nouvelles connexions échouent (les existantes persistent)

## Configuration dans un DevContainer

### Dockerfile

```dockerfile
FROM node:20-bookworm

RUN curl -fsSL https://tailscale.com/install.sh | sh

RUN apt-get update && apt-get install -y iptables
```

### Docker Compose (permissions spéciales requises)

```yaml
services:
  app:
    build: .
    cap_add:
      - NET_ADMIN
      - NET_RAW
    devices:
      - /dev/net/tun:/dev/net/tun
    environment:
      - TS_AUTHKEY=${TS_AUTHKEY}
```

> **Important** : Sans `NET_ADMIN` et `/dev/net/tun`, Tailscale ne peut pas créer l'interface réseau WireGuard.

### Démarrage automatique

```bash
# Dans postStartCommand du devcontainer.json
tailscaled --state=/var/lib/tailscale/tailscaled.state &
tailscale up --authkey=$TS_AUTHKEY --hostname=devcontainer-demo
```

## Coût

| Plan | Prix | Appareils |
|------|------|-----------|
| **Personal** | Gratuit | 100 appareils, 3 utilisateurs |
| **Starter** | 6$/utilisateur/mois | Illimité |
| **Premium** | 18$/utilisateur/mois | Fonctionnalités avancées |

## Cas d'usage idéaux

- Accès privé au DevContainer depuis n'importe où
- Collaboration d'équipe sur un environnement de développement partagé
- Accès à des bases de données distantes depuis un DevContainer
- Connexion SSH au conteneur depuis un appareil mobile

---

> **Voir aussi** : [02-cloudflare-tunnels.md](02-cloudflare-tunnels.md) | [04-comparatif.md](04-comparatif.md)
