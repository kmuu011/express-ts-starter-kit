#!/bin/bash

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 서버 디렉토리로 이동
cd "$PROJECT_ROOT/docker-compose/prod"

docker compose stop node_0
docker compose rm -f node_0
docker compose up -d --no-deps node_0

docker compose stop node_1
docker compose rm -f node_1
docker compose up -d --no-deps node_1
