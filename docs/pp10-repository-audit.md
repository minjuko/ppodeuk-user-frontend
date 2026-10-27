# PP10 Repository·보안 감사 (2026-10-27)

이 기록은 코드·테스트·lockfile·CI를 읽고 로컬 검증한 결과입니다. 운영 서버, DB, KakaoPay, 실제 기기와 스크린리더를 대상으로 한 침투·운영 검증은 아닙니다. 팀 작업과 개인 개선의 경계를 [architecture.md](architecture.md), 실행 절차를 [local-reproduction.md](local-reproduction.md)에서 함께 확인할 수 있습니다.

## 기준과 결과

- 감사 대상: `main`, 시작 HEAD `498125ce45009bc12403de781a51882d907546cc`; 시작 시 `origin/main`과 일치
- Vitest: 39개 파일, 165개 테스트 통과
- Playwright: Chromium 11개 테스트 통과. E2E 빌드에서 MSW fixture를 사용하며 실제 백엔드/PG에는 연결하지 않음
- PP10 인증 커밋의 GitHub Actions #79: 성공 — [실행 로그](https://github.com/minjuko/ppodeuk-user-frontend/actions/runs/40477404549). 문서 커밋 뒤의 Actions 검증은 해당 실행의 후속 run으로 확인합니다.
- 전체 의존성 감사: 취약 패키지 63개 항목 (Critical 5, High 29, Moderate 23, Low 6); package.json 직접 dev 의존성 12개, 전이 의존성 51개
- `npm audit --omit=dev`: 취약점 0건

## 예약·결제

| 영역 | 확인한 프론트엔드 동작 | 남은 서버·PG 계약 경계 |
|---|---|---|
| 가격 | 결제 금액 조회 응답의 `price`가 0 이상의 안전한 정수인지 검사하고, 유효하지 않으면 결제를 비활성화 | 결제 준비/승인 요청의 금액·예약 내용을 서버가 재계산·검증하는지 확인하지 않음. 클라이언트 검사는 위변조를 막지 못함 |
| 준비 응답 | 비어 있지 않은 TID와 현재 기기용 redirect 필드를 확인한 다음 TID 저장과 이동 수행 | 백엔드가 TID/금액/주문 사용자 매핑을 PG와 일치시키는지 검증하지 않음 |
| redirect | same-origin 상대 URL과 HTTPS URL 허용. `javascript:`, `data:`, 외부 HTTP, protocol-relative 및 사용자명·비밀번호 포함 URL은 거부하고 URL 파싱 실패는 안전한 오류 화면으로 처리 | HTTPS 외부 URL은 모두 허용하므로 정상 HTTPS 형태의 악성 도메인을 막지 못함. 실제 PG 허용 URL은 백엔드/PG 계약 확인 필요; 임의 허용 목록은 만들지 않음 |
| callback | `pg_token`, TID, 베이와 예약 구간이 갖춰진 경우에만 승인 요청. 직접 진입 또는 누락 시 승인을 막음 | `pg_token`은 callback query string에 들어오며 브라우저 주소·히스토리·관측 도구에 노출될 수 있음. 민감 query redaction 정책은 운영 환경에서 별도 확인 필요 |
| 승인·재시도 | 승인 진행 중 확인 버튼 비활성화. 실패 시 `CLEAR_PAYMENT`로 TID만 지우고 세차장·베이·예약 구간은 보존. 유효한 승인 응답일 때만 예약 상태 reset | 브라우저 한 탭의 UI 중복 방어일 뿐 서버 멱등성, 응답 유실 뒤 재요청 처리, PG 승인 결과 조회·보상은 검증하지 않음 |
| 클라이언트 저장 | Redux Persist의 기존 `root` 키에 예약 상태/TID가 저장되고 callback으로 돌아온 뒤 사용됨 | TID 및 예약 상태는 localStorage 경로에 존재. 결제 TID의 민감도·보존 기간·저장 정책은 백엔드/PG 계약과 함께 검토 필요 |

근거 테스트: `src/apis/paymentTypes.test.ts`, `src/components/templates/PaymentTemplate.test.jsx`, `PaymentWaitingTemplate.test.jsx`, `PaymentWaitingTemplate.response.test.jsx`, `PaymentWaitingTemplate.payload.test.jsx`, `src/mocks/demoFlow.test.js`, `e2e/reservation-payment.e2e.js`.

## 인증·세션

- `src/store/authSlice.js`는 로그인 응답의 `Authorization` 헤더를 공백 제거 후 `token` 키에 저장하고, `src/apis/instance.js`는 저장된 문자열을 Authorization 헤더에 그대로 전달합니다. 코드가 Bearer 접두사를 조합하지 않으므로 서버 발급 형식을 바꾸지 않습니다.
- 로그인 인증 실패와 네트워크/서버 오류는 기존 토큰을 보존합니다. 토큰 없는 성공 응답은 실패 처리하며 기존 토큰을 지웁니다. 사용자 정보 조회 401은 토큰과 인증 사용자 상태를 초기화하고, 503 테스트는 기존 토큰/사용자 상태를 보존합니다. 로그인 UI는 일부 인증 오류 코드를 일반 문구로 매핑하며 코드에서 token을 직접 로그하는 호출은 찾지 못했습니다. 사용자 정보 API 오류 본문은 Redux 오류 payload에 포함될 수 있어 로깅/telemetry 추가 시 민감 필드를 제거해야 합니다.
- `AuthLayout` 및 `AuthLayoutWithStatusBar`는 토큰 유무와 서버 사용자 확인을 통과해야 보호 화면을 렌더합니다. 확인 실패 시에는 로그인으로 이동하지만 401이 아니면 토큰을 유지합니다.
- `MainLayout`의 오류 처리 불일치를 수정했습니다. 401이면 `getUserInfoThunk`가 token과 Redux 인증 상태를 정리하고 `authExpired` 안내를 전달합니다. 503·다른 5xx·네트워크 오류에서는 token과 기존 사용자 상태를 보존하고 `authCheckFailed` 안내로 이동합니다. 두 경우 모두 기존 UX처럼 로그인 화면으로 이동하며 원래 경로를 전달합니다. `src/layouts/MainLayout.test.jsx`에서 token 없음, 정상 조회, 401, 503, 기타 5xx, 네트워크 오류를 테스트했습니다. 새로고침 복원과 로그아웃 정리는 기존 `src/store/authSlice.test.js` 테스트로 검증합니다.
- 로그아웃은 `token`, `persist:root` 저장값과 Redux 인증 사용자 상태를 지웁니다. Redux Persist의 저장 key는 변경하지 않았습니다.
- `localStorage`는 같은 origin에서 실행되는 JavaScript가 읽을 수 있으므로 XSS가 있으면 인증 토큰을 탈취할 수 있습니다. HttpOnly cookie 전환은 서버 쿠키 계약/SameSite·CSRF 정책이 필요하며 이 감사에서 구현하거나 완료된 것으로 주장하지 않습니다.

근거 테스트: `src/apis/instance.test.js`, `src/store/authSlice.test.js`, `src/layouts/AuthLayout.test.jsx`, `src/pages/reservationRouteGuards.test.jsx`.

## 화면·접근성 검증

- 검색 목록의 `DualBottomsheet`는 별도 44px 버튼 핸들에 drag gesture를 연결합니다. 핸들은 `aria-expanded`, `aria-controls`, 접근 가능한 이름을 제공하며 Tab/Enter/Space와 터치 스와이프를 검증합니다.
- Playwright는 예약 시작부터 결제 준비 화면까지, 검색·필터·베이·일정 선택, 오류/복귀 흐름을 확인합니다. 테스트의 대표 viewport와 작은 화면은 브라우저 에뮬레이션입니다.
- `e2e/reservation-payment.e2e.js`의 axe-core 검사는 주요 예약·결제 화면에서 WCAG 2.1 A/AA rule set을 사용합니다. 시간·이용 시간 버튼의 선택·비활성·값 변경 뒤 상태를 검사하고, 전환 중 대비 오류가 발생하던 국소 색상을 수정했습니다.
- 자동 axe 검사는 실제 기기, OS 확대/축소, VoiceOver/TalkBack/NVDA, 사용자별 보조 기술 경험을 대신하지 않습니다. 실제 모바일 기기와 스크린리더 검증은 수행하지 않았습니다. 지도 제스처도 키보드·axe 자동 검사로 완전히 평가할 수 없습니다.

## 데모·환경변수·공개 정보

- `.env.demo`, `.env.e2e`, `.env.example`은 tracked입니다. `.env`, `.env.demo.local`은 ignored 로컬 파일이며 tracked 파일이 아닙니다. 이번 로컬 확인에서 `.env`의 demo flag는 false, demo/E2E mode 파일은 true였고 demo/E2E API base는 상대 경로, 일반 로컬 API base는 localhost 설정이었습니다. 현재 배포용 API 주소는 이 감사에서 확인하거나 기재하지 않았습니다. 실제 값이나 로컬 환경값은 이 문서에 기록하지 않습니다.
- Vite의 `VITE_` 접두 변수는 브라우저 번들에 공개될 수 있습니다. `VITE_API_BASE_URL`은 서버 비밀값이 아니며, 지도 JavaScript 키도 브라우저에 노출되는 클라이언트 식별자이므로 사용처 제한/웹 origin 설정을 운영자 콘솔에서 확인해야 합니다. 비밀 JWT, DB 비밀번호, 서버 API secret을 넣으면 안 됩니다.
- production 빌드의 `__DEMO_BUILD__`은 false이고 demo/E2E 빌드만 true가 됩니다. MSW worker는 demo/E2E에서만 시작됩니다. `scripts/verify-production-bundle.mjs`는 production 산출물의 mock worker, demo fixture chunk, 데모 자격정보 marker를 검사합니다. GitHub Actions #79에서 production build 및 격리 검사가 성공했습니다.
- 데모 UI 일부는 `VITE_DEMO_MODE` 값도 읽으므로 배포 환경에서 실수로 true를 주입하지 않도록 배포 변수 설정을 관리해야 합니다. 번들 검증은 알려진 fixture/credential marker 검사이지 모든 미래 mock 코드에 대한 정적 증명은 아닙니다.
- 저장소의 `.env.example`은 placeholder를 쓰며, tracked demo/E2E의 지도 키는 비어 있습니다. 이 로컬 감사에서는 실제 서버 비밀정보를 확인하지 않았고, 무시된 개인 환경 파일의 값을 출력·문서화하지 않았습니다. 실제 지도 브라우저 키가 허용 origin 제한을 갖는지는 외부 콘솔에서 검증하지 않았습니다.
- E2E의 Playwright trace/screenshot/video는 실패 시 `test-results/e2e` 아래에 생성되며 `.gitignore` 대상입니다. CI workflow는 artifact 업로드 단계를 두지 않습니다. 테스트 데이터에는 가상의 계정·결제 callback 값이 포함될 수 있어 산출물을 공유하기 전에 확인이 필요합니다.

## npm 의존성 감사

2026-10-27 로컬 lockfile 설치 트리의 `npm audit --json` 기준입니다. `direct`는 package.json 직접 devDependency, `transitive`는 하위 의존성입니다. 모든 행은 `npm audit --omit=dev` 결과 0건과 대조해 현재 production 의존성 트리에는 포함되지 않은 개발 도구 위험으로 분류했습니다. 중첩된 여러 설치본은 쉼표로 표시합니다.

| 심각도 | 취약 패키지와 설치 버전 | 경로 |
|---|---|---|
| Critical | handlebars 4.7.8; proxy-addr 2.0.7; tar 6.2.0; tinypool 0.7.0; vitest 0.34.6 | 전이 4, 직접 dev 1 |
| High | @storybook/cli 7.4.5; @storybook/core-server 7.4.5; @xmldom/xmldom 0.8.10; body-parser 1.20.1; brace-expansion 2.0.1, 1.1.18; defu 6.1.2; express 4.18.2; extract-zip 1.7.0; flatted 3.2.9; giget 1.1.2; glob 10.3.10; ip 2.0.1; js-yaml 3.14.1, 4.1.0; lodash 4.17.21; minimatch 9.0.3, 5.1.6; nanoid 3.3.6; path-to-regexp 6.2.1, 0.1.7; postcss 8.4.30; puppeteer-core 2.1.1; rollup 3.29.4, 2.79.1; rollup-plugin-terser 7.0.2; serialize-javascript 4.0.0; source-map-js 1.0.2; storybook 7.4.5; tar-fs 2.1.1; tmp 0.0.33; vite 4.4.9; workbox-build 7.0.0; ws 6.2.2, 8.14.2 | 직접 dev: postcss, storybook, vite; 나머지 전이 |
| Moderate | @storybook/addon-actions 7.4.5; @storybook/addon-controls 7.4.5; @storybook/addon-docs 7.4.5; @storybook/addon-essentials 7.4.5; @storybook/addon-interactions 7.4.5; @storybook/addon-onboarding 1.0.8; @storybook/addon-styling 1.3.7; @storybook/blocks 7.4.5; @storybook/builder-manager 7.4.5; @storybook/builder-vite 7.4.5; @storybook/core-common 7.4.5; @storybook/docs-tools 7.4.5; @storybook/react 7.4.5; @storybook/react-vite 7.4.5; @storybook/telemetry 7.4.5; ajv 6.12.6, 8.12.0; ejs 3.1.9; esbuild 0.18.20; markdown-to-jsx 7.3.2; postcss-selector-parser 6.0.13; qs 6.11.0, 6.11.2; store2 2.14.2; uuid 9.0.1 | 직접 dev: addon-essentials, addon-interactions, addon-onboarding, addon-styling, blocks, react, react-vite; 나머지 전이 |
| Low | cookie 0.5.0, 0.4.2; external-editor 3.1.0; inquirer 8.2.6; msw 1.3.2; send 0.18.0; serve-static 1.15.0 | 직접 dev: msw; 나머지 전이 |

실행 경로는 Vite/esbuild/Rollup/PostCSS의 개발 서버·빌드 단계, Vitest/tinypool의 테스트 런타임, Storybook 실행·빌드, MSW mock 서버와 해당 도구 하위 라이브러리입니다. `npm ci`/설치 과정에서 내려받는 압축·파일 처리 하위 패키지도 개발 환경의 공급망·설치 위험입니다. production 의존성 트리에는 없지만 CI와 개발자 컴퓨터에서는 실행됩니다. 대표 원인 범주는 개발 서버/번들 도구의 XSS·파일 접근·임의 요청, parser/정규식·압축 해제의 DoS, archive 추출의 경로 이동/파일 덮어쓰기, template/parser의 XSS·prototype pollution입니다. 공격 가능성은 취약점별 사용 옵션과 입력 경로에 좌우되며, audit 등재만으로 운영 배포 노출이라고 단정하지 않습니다. 현재 CI가 production dependency만 감사해 통과하는 사실은 개발 서버·빌드·테스트 도구 위험을 해소하지 않습니다.

| 직접 dev dependency | 설치 버전 | npm audit 수정 메타데이터 |
|---|---:|---|
| `@storybook/*` 직접 패키지와 `storybook` | 7.4.5 (onboarding 1.0.8, styling 1.3.7) | audit은 일부 addon에 Storybook 8/10 major 후보를 제시합니다. addon-interactions와 `storybook`은 non-major fix metadata도 표시되며 실제 잠금 버전 검토 필요; addon 간 동시성·설정 migration 회귀 테스트 필요 |
| `msw` | 1.3.2 | 표시된 후보 3.0.3은 major 업그레이드; handler API 및 worker 호환 검사 필요 |
| `vitest` | 0.34.6 | 표시된 후보 5.0.5는 major 업그레이드; `tinypool` 포함 테스트 런타임 호환·테스트 실행 검토 필요 |
| `vite` | 4.4.9 | audit에서 수정 가능 metadata 표시; plugin/PWA/React SWC 호환성을 lockfile 변경 후 확인 필요 |
| `postcss` | 8.4.30 | audit에서 수정 가능 metadata 표시; Tailwind/Autoprefixer와 회귀 확인 필요 |

`npm audit`의 `fixAvailable`은 배포 호환성을 보장하지 않습니다. 직접 패키지 버전 범위, Storybook addon 동시성, MSW·Vitest major 전환과 CI 회귀 검증을 따로 설계해야 합니다. 이 PP10에서는 package.json/lockfile 변경이나 `npm audit fix`를 수행하지 않았습니다.

## GitHub Actions

`.github/workflows/ci.yml`은 `push`와 `pull_request`에서 실행됩니다. workflow 권한은 `contents: read`이고 `actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10` (v6.0.3) 및 `actions/setup-node@249970729cb0ef3589644e2896645e5dc5ba9c38` (v6.5.0)은 전체 커밋 SHA에 고정돼 있습니다. PR workflow에서 `secrets.*`를 참조하지 않아 workflow 정의상 repository secret을 job에 전달하지 않습니다. 다만 일반 `pull_request`에서 신뢰되지 않은 PR 코드가 실행되므로 action/패키지 공급망과 실행 코드 검토는 계속 필요합니다.

CI는 `.nvmrc`로 Node 버전을 선택하고 `npm ci`를 사용합니다. 순서대로 Vitest, lint, TypeScript 검사, production build 및 fixture 격리, demo/E2E build, Chromium 설치, Playwright E2E, production dependency audit을 실행합니다. `run` 단계 실패는 기본적으로 job 실패로 전달됩니다. 브라우저는 Ubuntu Chromium입니다. trace·screenshot·video는 failure-retained 설정이나 upload artifact 단계가 없어 workflow artifact로 전송되지 않습니다.

## PP09 후속 항목

1. 실제 backend/PG 계약을 확인해 서버 금액 재검증, callback/TID 보존·노출, 승인 응답 유실 및 서버 멱등성 정책을 문서화
2. PG 운영 도메인 허용 규칙을 계약으로 확인한 뒤 redirect allowlist 필요 여부를 결정
3. 개발 dependency를 그룹별로 업그레이드하고 lockfile·Storybook·MSW·Vitest·Vite 호환 및 CI 회귀 검증
4. 허가된 테스트 계정으로 실제 iOS/Android 기기와 스크린리더 사용성 검증
