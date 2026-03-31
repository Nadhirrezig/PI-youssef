# Comparatif : Cloudflare Tunnels vs Tailscale

## Tableau comparatif

| Critère | Cloudflare Tunnels | Tailscale |
|---------|-------------------|-----------|
| **Type d'accès** | Public (Internet) | Privé (réseau mesh) + Funnel pour public |
| **Protocole** | HTTP/S, TCP, UDP via reverse proxy | Tous protocoles (couche réseau L3 via WireGuard) |
| **Latence** | +10-50ms (passage par le edge CF) | ~1ms (connexion directe P2P) |
| **Setup Docker** | Simple (un binaire `cloudflared`) | Plus complexe (`NET_ADMIN`, `/dev/net/tun`) |
| **Domaine personnalisé** | Oui (domaine géré par Cloudflare) | Non natif (Funnel utilise `*.ts.net`) |
| **Protection DDoS** | Oui (réseau Cloudflare intégré) | Non |
| **ACL / Zero Trust** | Cloudflare Access (50 users gratuits) | ACL granulaires intégrées, SSO natif |
| **Multi-services** | Oui (ingress rules dans config.yml) | Oui (chaque port est accessible directement) |
| **Coût** | Gratuit | Gratuit (jusqu'à 100 appareils, 3 users) |
| **Dépendance externe** | Forte (nameservers Cloudflare requis) | Modérée (serveur de coordination, DERP relay) |
| **Cas d'usage idéal** | Exposer sur Internet, webhooks, démos | Accès équipe privé, dev collaboratif |
| **Complexité DevContainer** | Faible | Moyenne (permissions Docker supplémentaires) |
| **Persistance** | Tunnel nommé persistant | IP stable 100.x.x.x, état persistable |
| **Monitoring** | Dashboard Cloudflare, analytics intégrés | Dashboard Tailscale, `tailscale status` |

## Analyse détaillée

### Accès et connectivité

**Cloudflare Tunnels** excelle pour l'**accès public**. Un service est immédiatement accessible depuis Internet via une URL propre sur votre domaine. C'est la solution idéale quand vous avez besoin que des personnes externes (clients, partenaires, webhooks) accèdent à votre DevContainer.

**Tailscale** excelle pour l'**accès privé**. Tous les membres de votre réseau Tailscale peuvent accéder au DevContainer comme s'il était sur le réseau local. Avec Tailscale Funnel, un accès public est aussi possible, mais c'est une fonctionnalité secondaire avec des limitations.

### Performance

```
Latence typique (ping depuis Paris)

Cloudflare Tunnel : ~25ms (via edge Cloudflare)
Tailscale (P2P)   : ~5ms  (connexion directe)
Tailscale (DERP)  : ~15ms (via relay)
```

Tailscale est nettement plus performant grâce à la connexion peer-to-peer. Cloudflare ajoute une latence due au passage par son réseau, mais offre en contrepartie la mise en cache CDN.

### Sécurité

Les deux solutions sont excellentes en termes de sécurité :

- **Cloudflare** : Protection DDoS, WAF possible, Cloudflare Access pour l'authentification
- **Tailscale** : Chiffrement WireGuard de bout en bout, ACL granulaires, SSO

La différence clé : Cloudflare protège contre les menaces **externes** (DDoS), Tailscale sécurise les communications **internes** (chiffrement E2E).

### Complexité d'intégration DevContainer

```
Cloudflare : Dockerfile + cloudflared binary → Simple
Tailscale  : Dockerfile + NET_ADMIN + /dev/net/tun + daemon → Plus complexe
```

Cloudflare est plus simple à intégrer car il ne nécessite qu'un binaire qui fait des connexions sortantes. Tailscale nécessite des permissions Docker supplémentaires pour créer des interfaces réseau.

## Résumé visuel

```
                    Public                    Privé
                      │                         │
          ┌───────────┴───────────┐ ┌──────────┴───────────┐
          │  Cloudflare Tunnels   │ │      Tailscale       │
          │                       │ │                       │
          │  ✓ URL publique       │ │  ✓ Réseau mesh       │
          │  ✓ Domaine custom     │ │  ✓ P2P direct        │
          │  ✓ DDoS protection    │ │  ✓ Tous protocoles   │
          │  ✓ CDN intégré        │ │  ✓ ACL granulaires   │
          │                       │ │                       │
          │  ✗ Latence ajoutée    │ │  ✗ Setup Docker      │
          │  ✗ HTTP/TCP only      │ │  ✗ Pas de CDN        │
          └───────────────────────┘ └───────────────────────┘
```

---

> **Voir aussi** : [05-recommandations.md](05-recommandations.md)
