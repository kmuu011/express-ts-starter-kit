#!/bin/bash

# 프로젝트 초기 설정 스크립트
set -e  # 에러 발생 시 스크립트 중단

echo "프로젝트 초기 설정을 시작합니다..."

# 현재 디렉토리를 기준으로 server 디렉토리로 이동
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$SCRIPT_DIR/../server"

# server 디렉토리 존재 확인
if [ ! -d "$SERVER_DIR" ]; then
    echo "에러: server 디렉토리를 찾을 수 없습니다. ($SERVER_DIR)"
    exit 1
fi

# server 디렉토리로 이동
cd "$SERVER_DIR"
echo "server 디렉토리로 이동했습니다: $(pwd)"

# package.json 존재 확인
if [ ! -f "package.json" ]; then
    echo "에러: package.json 파일을 찾을 수 없습니다."
    exit 1
fi

# npm 의존성 설치
echo "npm 의존성을 설치합니다..."
npm ci

# dotenv 글로벌 설치
echo "dotenv를 글로벌로 설치합니다..."
npm i -g dotenv

echo "프로젝트 초기 설정이 완료되었습니다!"
