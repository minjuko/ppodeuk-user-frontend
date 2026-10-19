# 로컬 전체 스택 재현

이 안내는 `ppodeuk-backend`의 실제 `local` 프로필과 USER 프론트엔드를 사용한 통합 재현 절차입니다. 팀 백엔드를 새로 구현한 과정이 아니며, 사용자 예약 흐름과 로컬 결제 저장 경로를 다시 실행하는 범위입니다.

## 준비물

- Node.js 22.20 이상, npm 10.9 이상
- Java 17 및 백엔드 저장소의 Gradle wrapper
- 로컬 MariaDB, `bdbd` 데이터베이스
- `ppodeuk-user-frontend`와 `ppodeuk-backend` 저장소

## DB와 프로필

Backend `application-local.yml`은 아래 환경변수를 사용합니다. 실제 비밀번호와 JWT secret은 터미널 출력, Markdown, Git에 기록하지 않습니다.

| 변수 | 용도 |
|---|---|
| `BDBD_LOCAL_DB_URL` | 기본값 `jdbc:mariadb://localhost:3306/bdbd?allowPublicKeyRetrieval=true&useSSL=false` |
| `BDBD_LOCAL_DB_USERNAME` | 기본값 `bdbd` |
| `BDBD_LOCAL_DB_PASSWORD` | 로컬 DB 비밀번호, 기본값 없음 |
| `LOCAL_FRONTEND_ORIGIN` | 기본값 `http://localhost:5173` |
| `LOCAL_FRONTEND_ORIGINS` | 허용할 로컬 프론트 origin 목록 |

기존 DB에 접속하는 것만으로는 데이터를 초기화하지 않습니다. `ppodeuk-backend/scripts/seed-local.sql`은 자동 실행되지 않으며, 고정 ID의 데모 레코드와 해당 seed 범위의 예약을 교체할 수 있습니다. 기존 예약을 보존해야 하면 seed를 실행하지 마세요.

seed 전용 데모 계정은 `test-user@example.com` / `test1234!`입니다. 이 공개 테스트 자격증명을 운영·공유 서비스에서 사용하지 마세요. 실 DB 비밀번호, JWT, Kakao/AWS key를 프론트 `.env`나 Git에 넣지 마세요.

## 실행 순서

### 1. MariaDB

MariaDB 서비스를 시작하고 `bdbd` 데이터베이스 및 사용자 권한을 준비합니다. 데이터가 필요할 때만 백엔드 저장소의 `scripts/seed-local.sql`을 검토 후 수동 실행합니다.

### 2. Backend

PowerShell에서 비밀값은 현재 프로세스 환경변수로만 제공합니다.

```powershell
$env:BDBD_LOCAL_DB_PASSWORD='<local-only password>'
$env:LOCAL_FRONTEND_ORIGIN='http://localhost:5173'
./gradlew.bat bootRun --args='--spring.profiles.active=local'
```

필요한 경우 `BDBD_LOCAL_DB_URL`과 `BDBD_LOCAL_DB_USERNAME`도 설정합니다. 백엔드 기본 주소는 `http://localhost:8080`입니다. local 프로필은 외부 KakaoPay 대신 로컬 테스트용 결제 구현을 사용합니다.

### 3. USER Frontend 실제 API 모드

`.env`를 `.env.example`에 맞춰 준비합니다.

```dotenv
VITE_API_BASE_URL=http://localhost:8080
VITE_KAKAOMAP_API_KEY=your_kakao_javascript_key
VITE_DEMO_MODE=false
```

```bash
npm ci
npm run dev
```

개발 서버는 `http://localhost:5173`에 고정됩니다. 해당 포트를 사용할 수 없으면 Vite가 임의의 포트로 이동하지 않고 종료합니다. Kakao 지도 키가 없으면 지도 검증을 건너뜁니다.

### Mock 데모

Backend 없이 화면 흐름을 확인할 때는 별도 터미널에서 실행합니다.

```bash
npm run dev:mock
```

Mock 데모 계정은 위의 공개 테스트 계정입니다. 데모 결제는 실제 결제가 아니며, 메모리 seed는 새로고침하면 초기화됩니다. 데모 프로덕션 산출물이 필요하면 `npm run build:demo:local` 후 `npm run preview:demo`를 사용합니다(기본 `http://localhost:4173`).

## 검증된 로컬 smoke 범위

```text
로그인 → 세차장/Bay 선택 → 날짜·시간 선택 → 금액 계산
→ local payment ready/callback/approve → MariaDB 예약 저장
→ USER 예약 내역 반영
```

이 경로에서 프론트엔드와 로컬 MariaDB를 연결한 모의 결제 승인까지 브라우저로 확인했습니다. 테스트 예약 1건이 기존 로컬 DB에 남아 있을 수 있습니다. 운영 결제, KakaoPay E2E, OWNER 전체 흐름, AWS/S3 통합은 검증 범위가 아닙니다.
