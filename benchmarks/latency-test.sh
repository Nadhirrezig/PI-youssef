#!/bin/bash
# Test de latence - Mesure le temps de réponse moyen sur plusieurs requêtes
# Usage : ./latency-test.sh <URL> [nombre_de_requêtes]

URL=${1:-"http://localhost:3000/api/hello"}
COUNT=${2:-10}

echo "=== Test de latence ==="
echo "URL    : $URL"
echo "Requêtes : $COUNT"
echo "========================"
echo ""

TOTAL=0
SUCCESS=0

for i in $(seq 1 $COUNT); do
    TIME=$(curl -s -o /dev/null -w "%{time_total}" "$URL" 2>/dev/null)
    EXIT_CODE=$?

    if [ $EXIT_CODE -eq 0 ]; then
        TIME_MS=$(echo "$TIME * 1000" | bc 2>/dev/null || echo "$TIME")
        printf "Requête %2d : %.2f ms\n" "$i" "$TIME_MS"
        TOTAL=$(echo "$TOTAL + $TIME_MS" | bc 2>/dev/null || echo "$TOTAL")
        SUCCESS=$((SUCCESS + 1))
    else
        printf "Requête %2d : ÉCHEC\n" "$i"
    fi

    sleep 0.5
done

echo ""
echo "========================"
echo "Réussies : $SUCCESS / $COUNT"

if [ $SUCCESS -gt 0 ]; then
    AVG=$(echo "scale=2; $TOTAL / $SUCCESS" | bc 2>/dev/null || echo "N/A")
    echo "Moyenne  : ${AVG} ms"
fi

echo "========================"
