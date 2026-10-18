# Local Full-stack Reproduction

이 문서는 [Team10_BE fork](https://github.com/minjuko/Team10_BE)의 실제 `local` profile과 seed를 기준으로 합니다. 2023 Backend를 새로 개발한 절차가 아니라, USER Live Mode integration을 다시 실행하기 위한 최소 재현 범위입니다.

## Prerequisites

- Java 17
- Backend 저장소에 포함된 Gradle wrapper
- local MariaDB와 `bdbd` database
- Node.js/npm
- USER Frontend와 Backend fork를 각각 clone한 작업 디렉터리

## Profile Isolation

| 구분 | local | non-local / production |
|---|---|---|
| Payment service | `LocalPaymentService` (`@Profile("local")`) | KakaoPay `PayService` (`@Profile("!local")`) |
| External payment | `payment.external.enabled=false` | 환경별 KakaoPay 설정 |
| AWS config | 제외 | production profile에서 활성화 |
| Frontend origin | `LOCAL_FRONTEND_ORIGIN`, 기본 `http://localhost:5173` | 배포 origin |
| Database | `LOCAL_DB_*` 환경변수 | 배포 database 설정 |

local profile의 기본 DB URL은 `jdbc:mariadb://localhost:3306/bdbd?allowPublicKeyRetrieval=true&useSSL=false`, 기본 username은 `bdbd`입니다. password에는 기본값이 없으므로 `LOCAL_DB_PASSWORD`를 실행 환경에서 제공해야 합니다. 실제 값을 문서나 Git에 기록하지 마세요.

## Seed

Backend의 `scripts/seed-local.sql`은 Spring이 자동 실행하지 않습니다. `bdbd` local database에 MariaDB client로 수동 적용합니다. 이 script는 고정된 portfolio ID만 FK 순서로 교체하며, local payment smoke로 생성된 해당 demo 예약도 초기화합니다.

seed에는 다음 local-only USER가 포함됩니다.

| 항목 | 값 |
|---|---|
| Email | `test-user@example.com` |
| Password | `test1234!` |

공개된 재현 전용 credential이므로 shared/production 환경에 재사용하지 말고, 로그인 후 발급된 JWT를 저장하거나 문서에 복사하지 마세요.

## Run Order

### 1. MariaDB

1. local MariaDB를 시작합니다.
2. `bdbd` database와 권한을 준비합니다.
3. Backend의 `scripts/seed-local.sql`을 해당 database에 수동 적용합니다.

### 2. Spring Boot

PowerShell에서 secret은 현재 session 환경변수로만 제공합니다.

```powershell
$env:LOCAL_DB_PASSWORD='<local-only password>'
$env:LOCAL_FRONTEND_ORIGIN='http://localhost:5173'
./gradlew.bat bootRun --args='--spring.profiles.active=local'
```

필요한 경우 `LOCAL_DB_URL`과 `LOCAL_DB_USERNAME`도 `application-local.yml`의 이름 그대로 설정합니다. local callback URL은 `http://localhost:5173/paymentwaiting`, cancel/fail URL은 `http://localhost:5173/paymentfail`입니다.

### 3. USER Frontend Live Mode

USER `.env`를 `.env.example`의 변수명에 맞춰 설정합니다.

```dotenv
VITE_API_BASE_URL=http://localhost:8080
VITE_KAKAOMAP_API_KEY=your_kakao_javascript_key
VITE_DEMO_MODE=false
```

```bash
npm ci
npm run dev
```

`VITE_DEMO_MODE=false`에서는 MSW worker가 로드되지 않고 요청이 Spring Boot로 전달됩니다. 프론트 개발 서버는 Kakao 지도 허용 도메인과 맞추기 위해 `http://localhost:5173`에 고정되며, 포트가 이미 사용 중이면 다른 포트로 자동 이동하지 않고 종료합니다.

### USER Frontend Mock Demo

백엔드 없이 화면과 예약 흐름을 확인할 때는 mock 전용 계정 `test-user@example.com` / `test1234!`를 사용합니다. 이 계정은 MSW 데모와 `scripts/seed-local.sql`의 로컬 통합 재현 계정에 맞춰 둔 공개 테스트 전용 계정입니다. 운영·공유 서비스에서는 사용하지 마세요.

```bash
npm run dev:mock
```

데모 빌드 결과는 `npm run build:demo:local` 후 `npm run preview:demo`로 확인합니다. 데모 미리보기는 `http://localhost:4173`에 고정됩니다.

## Verified Smoke Scope

```text
로그인 → JWT → 세차장 → Bay → 예약시간 → 가격 계산
→ local payment ready → callback → approve
→ MariaDB reservation insert → USER 예약 내역 반영
```

추가한 핵심 Backend regression tests는 19개입니다.

- `LocalPaymentServiceTest`: 10
- `ReservationDateTimeRegressionTest`: 5
- `LiveIntegrationRegressionTest`: 4

이는 legacy 전체 test suite 통과를 뜻하지 않습니다. 일부 legacy controller test에는 fixture isolation backlog가 있습니다. OWNER는 로그인·조회 중심 smoke 범위이며 AWS/S3 local flow와 production KakaoPay E2E는 검증하지 않았습니다.
