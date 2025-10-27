cd ..
cd docker-compose
cd prod

docker compose stop node_0
docker compose rm -f node_0
docker compose up -d --no-deps node_0

docker compose stop node_1
docker compose rm -f node_1
docker compose up -d --no-deps node_1
