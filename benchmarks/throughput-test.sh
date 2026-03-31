#!/bin/bash
# Test de débit (throughput) - Utilise wrk ou hey pour mesurer les performances
# Usage : ./throughput-test.sh <URL> [durée_secondes] [connexions]

URL=${1:-"http://localhost:3000/api/hello"}
DURATION=${2:-10}
CONNECTIONS=${3:-10}

echo "=== Test de débit ==="
echo "URL         : $URL"
echo "Durée       : ${DURATION}s"
echo "Connexions  : $CONNECTIONS"
echo "====================="
echo ""

# Essayer wrk d'abord, puis hey, puis curl en fallback
if command -v wrk &> /dev/null; then
    echo "[Outil : wrk]"
    echo ""
    wrk -t2 -c"$CONNECTIONS" -d"${DURATION}s" "$URL"

elif command -v hey &> /dev/null; then
    echo "[Outil : hey]"
    echo ""
    hey -z "${DURATION}s" -c "$CONNECTIONS" "$URL"

else
    echo "[Outil : curl (fallback - wrk/hey non disponibles)]"
    echo "  Installez wrk : apt-get install wrk"
    echo "  Ou hey       : go install github.com/rakyll/hey@latest"
    echo ""

    START=$(date +%s)
    COUNT=0

    while [ $(($(date +%s) - START)) -lt "$DURATION" ]; do
        curl -s -o /dev/null "$URL" && COUNT=$((COUNT + 1))
    done

    echo "Requêtes complétées : $COUNT en ${DURATION}s"
    RPS=$(echo "scale=2; $COUNT / $DURATION" | bc 2>/dev/null || echo "N/A")
    echo "Débit approximatif  : ${RPS} req/s"
fi

echo ""
echo "====================="
