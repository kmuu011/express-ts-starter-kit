#!/bin/bash

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 초기화 및 배포 실행
cd "$PROJECT_ROOT/commands"
./init.sh
./prod-build-server-image.sh

# 전체 서비스 시작
cd "$PROJECT_ROOT/docker-compose/prod"
docker compose up -d
