FROM node:20-bookworm

# Installation de Tailscale
RUN curl -fsSL https://tailscale.com/install.sh | sh

# Outils utilitaires
RUN apt-get update && apt-get install -y \
    curl \
    jq \
    iptables \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
