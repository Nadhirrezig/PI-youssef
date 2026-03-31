FROM node:20-bookworm

# Installation de cloudflared
RUN curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o /tmp/cloudflared.deb \
    && dpkg -i /tmp/cloudflared.deb \
    && rm /tmp/cloudflared.deb

# Outils utilitaires
RUN apt-get update && apt-get install -y \
    curl \
    jq \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
