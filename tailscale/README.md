# Tailscale - Guide de configuration

## Prérequis

- Docker et Docker Compose installés
- VS Code avec l'extension [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- Un compte Tailscale (gratuit jusqu'à 100 appareils)

## Étape 1 : Générer une clé d'authentification

1. Connectez-vous sur [Tailscale Admin](https://login.tailscale.com/admin/settings/keys)
2. Cliquez sur **Generate auth key**
3. Cochez **Reusable** et **Ephemeral** (recommandé pour les DevContainers)
4. Copiez la clé générée

## Étape 2 : Configurer l'environnement

```bash
# Copier le fichier exemple
cp tailscale.env.example tailscale.env

# Éditer et coller votre clé
nano tailscale.env
```

Remplacez `tskey-auth-XXXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` par votre vraie clé.

## Étape 3 : Lancer le DevContainer

1. Ouvrez ce dossier dans VS Code
2. Appuyez sur `Ctrl+Shift+P` → **Dev Containers: Reopen in Container**
3. Attendez que le conteneur se construise

> **Note** : Le conteneur nécessite `NET_ADMIN` et l'accès à `/dev/net/tun` pour que Tailscale fonctionne.

## Étape 4 : Démarrer Tailscale

Dans le terminal du conteneur :

```bash
# Démarrer le daemon Tailscale
tailscaled --state=/var/lib/tailscale/tailscaled.state &

# Connecter avec la clé d'authentification
tailscale up --authkey=$TS_AUTHKEY --hostname=devcontainer-demo
```

## Étape 5 : Vérifier la connexion

```bash
# Vérifier le statut
tailscale status

# Obtenir l'IP Tailscale du conteneur
tailscale ip -4
```

Vous obtiendrez une IP de type `100.x.x.x`.

## Étape 6 : Accéder à l'application

Depuis n'importe quel appareil connecté à votre réseau Tailscale :

```bash
# Remplacez par l'IP obtenue à l'étape 5
curl http://100.x.x.x:3000/api/hello
```

Réponse attendue :
```json
{
  "message": "Hello from DevContainer",
  "timestamp": "2026-03-31T12:00:00.000Z",
  "tunnel": "tailscale"
}
```

## Accès public avec Tailscale Funnel

Pour exposer le service sur Internet (comme Cloudflare Tunnels) :

```bash
# Activer Funnel pour le port 3000
tailscale funnel 3000
```

L'URL publique sera affichée, par exemple : `https://devcontainer-demo.tailnet-xxxx.ts.net/`

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `tailscale status` | Voir les appareils connectés |
| `tailscale ip -4` | Obtenir l'IP Tailscale |
| `tailscale ping <machine>` | Tester la latence vers une machine |
| `tailscale funnel 3000` | Exposer le port 3000 publiquement |
| `tailscale funnel --reset` | Désactiver Funnel |
| `tailscale down` | Déconnecter |

## Dépannage

- **Erreur NET_ADMIN** : Vérifiez que `docker-compose.yml` contient `cap_add: NET_ADMIN`
- **`/dev/net/tun` absent** : Le device doit être monté dans docker-compose
- **Clé expirée** : Régénérez une clé sur le dashboard Tailscale
- **Pas de connectivité** : Vérifiez `tailscale status` et que le daemon tourne
