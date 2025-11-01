#!/bin/bash

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 서버 디렉토리로 이동
cd "$PROJECT_ROOT/server"

# 서버 실행
npm run dev:start

if [ "$DISPLAY" ] || [ "$WAYLAND_DISPLAY" ]; then
    echo "서버가 종료되었습니다. 아무 키나 누르면 터미널이 닫힙니다..."
    read -n 1 -s
fi
