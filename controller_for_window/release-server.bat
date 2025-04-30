cd ..
cd docker-compose
cd express_ts_starter_kit_production

docker compose stop node_0
docker compose rm -f node_0
docker compose up -d --no-deps node_0

docker compose stop node_1
docker compose rm -f node_1
docker compose up -d --no-deps node_1
