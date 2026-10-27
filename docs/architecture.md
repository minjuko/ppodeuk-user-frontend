# 시스템 구조와 실행 모드

## 프로젝트 범위

이 저장소는 뽀득뽀득의 사용자용 React 프론트엔드입니다. 2023년 팀 프로젝트에서 사용자 예약 흐름을 중심으로 구현했고, 2026년 개인 개선에서는 예약 상태와 시간 규칙, 결제 결과 처리, 인증 예외, 접근성·반응형, 자동 검증과 재현 문서를 보완했습니다. 팀 백엔드와 사업자용 프론트엔드 전체를 개인 구현으로 표현하지 않습니다.

## 운영 구조

```mermaid
flowchart LR
  Browser[사용자 브라우저] --> Vercel[USER Frontend<br/>Vercel]
  Vercel -->|HTTPS / JWT| Backend[Spring Boot<br/>Railway Hobby]
  Backend --> DB[(MariaDB<br/>Railway Volume)]
  Browser -. 지도 SDK .-> Kakao[Kakao Maps]
  Backend -. 결제 요청 .-> Pay[KakaoPay]
```

구성도는 기존 배포 구성 기록입니다. Railway 백엔드와 MySQL은 2026-10-19 확인 당시 Serverless가 꺼져 있었고 두 서비스 모두 Online으로 관측됐습니다. 이 문서는 현재 운영 상태나 응답 가능성을 확인했다는 뜻이 아닙니다. 재확인은 [배포·운영 안내](deployment-operations.md)의 절차를 따릅니다.

## 프론트엔드 데이터 경계

| 데이터 | 소유 위치 | 사용 기술 |
|---|---|---|
| 현재 화면의 날짜·시각·이용 시간 | 화면 컴포넌트 | React local state |
| 여러 예약 경로가 공유하는 선택과 결제 상태 | client state | Redux Toolkit / Redux Persist |
| 세차장·Bay·예약 현황 등 서버 원본 | server state | TanStack Query |
| 화면 이동과 경로 식별자 | router | React Router |
| API 통신 및 JWT 전달 | API layer | Axios instance / interceptor |

서버가 원본인 조회 데이터와 사용자가 예약 과정에서 임시로 선택한 상태를 분리합니다. 세차장·Bay 등 상위 조건이 바뀌면 기존 예약 조회와 결제 식별값을 무효화하고, 날짜가 바뀌면 시작 시각과 이용 시간을 초기화합니다.

## 실행 모드

### 실제 API 연동

일반 `dev` 및 production 빌드는 Vite 환경변수의 API 주소로 백엔드 API를 호출합니다. `VITE_` 변수는 클라이언트 번들로 공개될 수 있으므로 비밀값을 담으면 안 됩니다. 운영 KakaoPay 승인 E2E는 검증하지 않았습니다.

### Mock 데모

`npm run dev:mock`은 demo mode에서 MSW worker를 동적으로 시작합니다. production build는 `__DEMO_BUILD__`이 false여서 MSW 시작을 선택하지 않고, demo/E2E build에서만 true가 됩니다. 데모 API는 메모리 seed를 사용하며 새로고침하면 초기화됩니다. 등록되지 않은 `/api/*` 요청은 실패 처리해 Mock 실행 중 실 API로 조용히 빠져나가지 않게 합니다. 데모 결제는 실제 결제가 아닙니다. demo UI 일부는 `VITE_DEMO_MODE`에도 반응하므로 production 환경에 true가 주입되지 않는지 배포 변수를 관리해야 합니다.

### 로컬 전체 스택

USER 프론트를 `VITE_DEMO_MODE=false`로 실행하고 `ppodeuk-backend`의 `local` 프로필 및 로컬 MariaDB에 연결합니다. local 프로필의 결제 구현은 예약·DB 저장 검증용이며 실제 KakaoPay와 분리돼 있습니다. 정확한 실행 순서와 환경변수는 [로컬 전체 스택 재현](local-reproduction.md)을 참고합니다.

## 결제 및 예약 검증 경계

- 프론트엔드는 현재 조회 결과를 기반으로 유효하지 않은 시간 조합을 미리 비활성화합니다.
- 시간 계산은 순수 함수로 분리해 영업 경계, 기존 예약과의 겹침, 인접 예약, 당일 과거 시간 등을 독립 검증합니다.
- 백엔드는 요청 시점에 예약 가능 여부와 금액을 최종 검증해야 합니다. 프론트엔드 사전 검사는 동시 요청에 대한 데이터 무결성을 보장하지 않습니다.
- 가격 계산 응답은 0 이상의 안전한 정수인지 검사합니다. ready 응답은 비어 있지 않은 TID 및 redirect URL을 검증하고 `javascript:`, `data:`, 외부 HTTP, protocol-relative 및 자격정보가 포함된 URL을 거부합니다. same-origin 상대 URL과 HTTPS 외부 URL은 허용합니다. HTTPS 악성 도메인은 목적지 검증 없이 막지 못합니다.
- callback의 `pg_token`과 영속 상태의 TID·예약 정보가 있을 때만 approve를 실행하고, 승인 중 버튼 입력을 비활성화합니다. 이 UI 방어는 서버 멱등성이나 PG 응답 유실 처리를 검증하지 않습니다.
- 운영 결제 E2E, DB 수준의 예약 동시성 제어, 외부 결제 성공 뒤 예약 저장 실패의 보상 처리는 검증 범위에 포함하지 않습니다.

## 인증과 검증 경계

- 서버가 반환한 Authorization 값을 `localStorage`에 저장하고 Axios 요청에 그대로 전달합니다. 브라우저 JavaScript에서 읽히는 저장 방식이므로 XSS에 토큰이 노출될 위험이 있습니다. HttpOnly cookie로 전환하려면 서버 계약과 쿠키·CSRF 정책이 필요합니다.
- `MainLayout`과 보호 경로는 사용자 정보 조회에서 401이면 `getUserInfoThunk`가 token과 Redux 인증 상태를 정리하고 만료 안내로 이동합니다. 5xx·네트워크 오류에서는 token을 보존하고 `authCheckFailed` 안내로 로그인 화면에 이동합니다. 공개 화면은 기존 라우트 정책대로 로그인 상태 확인 실패 안내를 사용합니다.
- 재현 환경, 테스트 경계, 잔여 취약점의 상세 수치는 [PP10 Repository·보안 감사](pp10-repository-audit.md)를 참고합니다.
