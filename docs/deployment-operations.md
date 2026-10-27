# 배포·운영 안내

## 기존 배포 구성과 현재 확인 상태

아래 표는 저장소에 남아 있는 배포 구성 기록입니다. 현재 서비스 연결·도메인 소유·배포 여부는 이 문서 수정 시점에 다시 확인하지 않았습니다.

| 구성요소 | 서비스 | 반영 방식 |
|---|---|---|
| USER Frontend | Vercel Production (`ppodeuk-user.vercel.app`) | `main` push 후 자동 배포 |
| Backend API | Railway `Team10_BE` 서비스 (`ppodeuk-backend` 저장소) | 백엔드 코드를 바꾸면 Railway에서 수동 재배포 |
| Database | Railway MySQL + 영속 `mysql-volume` | Backend가 내부 연결 |
| 지도 | Kakao Maps JavaScript SDK | 브라우저에서 실행 |
| 결제 | KakaoPay 연동 코드 | 운영 결제 E2E 미검증 |

마지막 기록(2026-10-19) 당시 Railway 프로젝트 `agile-ambition`은 Hobby 플랜이었고 Backend·MySQL Serverless가 꺼져 있었으며 둘 다 Online이었습니다. 데이터베이스 volume은 그대로 연결돼 있었습니다. 이 관측은 현재 서비스 상태나 실제 접근 가능 여부를 보장하지 않습니다. 운영 또는 배포 상태를 설명하기 전에 Railway 및 Vercel에서 다시 확인하고 확인 시점을 기록합니다.

## 배포 확인 순서

### 프론트엔드

1. `main`의 원격 변경을 먼저 확인합니다. README나 lockfile 등 원격 변경이 있으면 fast-forward로 반영하고 충돌 여부를 검토합니다.
2. 사용자용 변경을 `main`에 push합니다. Vercel Production 배포가 해당 커밋 기준으로 Ready인지 확인합니다.
3. 비로그인 홈·세차장 목록·상세, 보호 경로 로그인 유도, 모바일 레이아웃을 확인합니다.
4. 네트워크와 콘솔에서 API 실패를 살펴봅니다. 추천 API fallback 예시 카드가 보이면 실제 API 데이터와 혼동하지 않도록 안내 문구도 확인합니다.

### 백엔드

백엔드 repository 변경은 USER 프론트엔드 배포를 자동으로 반영하지 않습니다. Railway에서 최신 backend repository commit으로 재배포하고 배포 로그, 서비스 Online 상태, API 응답을 확인합니다. DB schema 또는 seed 변경 전에는 실제 영향 범위를 검토합니다.

읽기 경로 기본 확인 예시:

```text
GET /api/open/carwashes/recommended?latitude=37.5665&longitude=126.9780
```

운영 데이터나 결제를 바꾸는 검증은 피하고 공개 조회 API와 서비스 health/log를 사용합니다.

## 콜드 스타트와 상태 점검

과거 Free/Serverless 구성에서는 유휴 후 첫 요청이 약 1분 걸릴 수 있었습니다. 2026-10-19 Hobby 적용 뒤 Serverless를 끄고 두 서비스를 Online으로 확인했으므로, 다음 점검은 실제 응답 시간과 usage를 기준으로 기록합니다. 콜드 스타트 가정을 자동으로 현재 상태에 적용하지 않습니다.

전환 직후 Usage 화면은 2026-10-10~2026-11-10 주기에서 약 `$0.05` 리소스 사용량과 `$5` 포함 사용량을 보였습니다. 이는 초기 시점의 관측치이지 월말 예상 청구액이 아닙니다. 약 일주일 실제 상시 구동 후 Backend·MySQL 비용과 메모리를 확인하고 갱신 주기 전에 총액을 검토합니다. 메모리 변경은 실제 지표를 보고 판단합니다.

## 환경변수와 비밀값

- Vercel에는 `VITE_API_BASE_URL` 등 production 프론트 설정을 등록합니다. `VITE_` 접두 변수는 브라우저 번들에서 공개될 수 있으므로 secret을 지정하지 말고, demo 환경변수는 production에 주입되지 않도록 분리합니다. Kakao Maps JavaScript key는 secret이 아니지만 허용 origin 제한을 운영 콘솔에서 설정해야 합니다. 환경변수의 이름과 값이 바뀌면 해당 환경에 새 배포가 필요합니다.
- Railway Backend에는 DB 연결 및 인증·외부 연동 환경변수를 등록합니다. DB 비밀번호, JWT secret, Kakao/AWS 키를 Markdown, Git, 출력 로그에 저장하지 않습니다.
- MySQL 접속값은 Railway private service 연결 설정을 따릅니다. DB를 초기화하는 seed나 migration은 production 대상으로 임의 실행하지 않습니다.

## 장애 분리 순서

1. 브라우저 개발자 도구에서 URL, status code, 요청 시간, response body를 기록합니다. Network의 `canceled`는 HTTP status가 아닐 수 있습니다.
2. 프론트의 fallback·timeout 문제인지 확인하려고 동일 API를 직접 조회합니다.
3. Backend deploy log와 runtime log에서 시작 실패, DB 연결 오류, 재시작을 분리해 봅니다.
4. DB 상태와 volume attachment, Backend 연결 상태를 확인합니다. 과거 `Server shutdown in progress`는 DB 연결 끊김을 직접 원인으로 확인했지만 종료의 근본 사유까지는 확정하지 못했습니다.
5. API 응답과 UI fallback을 각각 재검증하고, 해결 커밋과 배포 시점을 기록합니다.
