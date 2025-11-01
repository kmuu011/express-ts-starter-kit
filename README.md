# express-ts-starter-kit

## Prerequisites
- **Node.js v22** 이상
- **Docker Desktop** 설치

## Linux 환경에서 개발 서버 실행 방법
1. **실행 권한 부여**  
   `chmod +x ./commands/*` 실행

2. **초기 설정 및 첫 실행**  
   `./commands/dev-first-run.sh` 파일을 실행합니다.  
   (초기화 및 Docker Compose로 개발 환경 서비스 시작)

3. **서버 실행**  
   `./commands/dev-open-server.sh` 파일을 실행하면 서버가 시작됩니다.

4. **서버 빌드 (선택)**  
   `./commands/dev-build.sh` 파일을 실행하면 TypeScript를 빌드합니다.

## Linux 환경에서 Production 서버 무중단 배포 방법
1. **초기 설정 및 첫 실행**  
   `./commands/prod-first-run.sh` 파일을 실행합니다.  
   (최초 1회만 실행)

2. **수정사항 반영 시 - 이미지 빌드**  
   `./commands/prod-build-server-image.sh` 실행

3. **수정사항 반영 시 - 컨테이너 순차적 재구동**  
   `./commands/prod-release-server.sh` 실행  
   (node_0, node_1 컨테이너를 순차적으로 재시작하여 무중단 배포)

