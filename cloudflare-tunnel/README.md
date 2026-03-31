# Cloudflare Tunnel - Guide de configuration

## Prérequis

- Docker et Docker Compose installés
- VS Code avec l'extension [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- Un compte Cloudflare (gratuit)
- Un domaine configuré sur Cloudflare

## Étape 1 : Lancer le DevContainer

1. Ouvrez ce dossier dans VS Code
2. Appuyez sur `Ctrl+Shift+P` → **Dev Containers: Reopen in Container**
3. Attendez que le conteneur se construise et démarre

## Étape 2 : Authentification Cloudflare

Dans le terminal du conteneur :

```bash
cloudflared tunnel login
```

Cela ouvrira un navigateur pour vous authentifier. Un certificat sera stocké dans `~/.cloudflared/cert.pem`.

## Étape 3 : Créer un tunnel

```bash
# Créer le tunnel
cloudflared tunnel create mon-devcontainer

# Vérifier qu'il existe
cloudflared tunnel list
```

## Étape 4 : Configurer le tunnel

```bash
# Copier le fichier exemple
cp config.yml.example ~/.cloudflared/config.yml
```

Éditez `~/.cloudflared/config.yml` :
- Remplacez `VOTRE-TUNNEL-ID` par l'ID retourné à l'étape 3
- Remplacez `votre-app.votre-domaine.com` par votre sous-domaine

## Étape 5 : Configurer le DNS

```bash
cloudflared tunnel route dns mon-devcontainer votre-app.votre-domaine.com
```

## Étape 6 : Lancer le tunnel

```bash
# Démarrer l'application (si pas déjà lancée)
cd /workspace/demo-app && TUNNEL_TYPE=cloudflare node server.js &

# Lancer le tunnel
cloudflared tunnel run mon-devcontainer
```

## Étape 7 : Tester

Ouvrez `https://votre-app.votre-domaine.com` dans votre navigateur.

Vous devriez voir la page d'accueil de l'application et pouvoir tester l'API :

```bash
curl https://votre-app.votre-domaine.com/api/hello
```

Réponse attendue :
```json
{
  "message": "Hello from DevContainer",
  "timestamp": "2026-03-31T12:00:00.000Z",
  "tunnel": "cloudflare"
}
```

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `cloudflared tunnel list` | Lister les tunnels |
| `cloudflared tunnel info <nom>` | Détails d'un tunnel |
| `cloudflared tunnel run <nom>` | Lancer un tunnel |
| `cloudflared tunnel delete <nom>` | Supprimer un tunnel |
| `cloudflared tunnel route dns <nom> <hostname>` | Configurer le DNS |

## Dépannage

- **Erreur d'authentification** : Relancez `cloudflared tunnel login`
- **Port déjà utilisé** : Vérifiez avec `lsof -i :3000`
- **Tunnel ne démarre pas** : Vérifiez que le fichier credentials existe dans `~/.cloudflared/`
