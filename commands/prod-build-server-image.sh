#!/bin/bash

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$PROJECT_ROOT"

docker build -t production/ts-express:latest -f ./docker-compose/prod/docker_file/node/Dockerfile .