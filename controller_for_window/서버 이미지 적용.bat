cd ..
cd docker-compose
cd express_ts_starter_kit_production

docker compose down node_0
docker compose up node_0 -d
docker compose down node_1
docker compose up node_1 -d