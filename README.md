# 뽀득뽀득 — USER 프론트엔드

> 셀프세차장 탐색부터 세차 공간(Bay) 예약·결제·리뷰까지 제공하는 모바일 중심 웹 서비스

[![CI](https://github.com/minjuko/ppodeuk-user-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/minjuko/ppodeuk-user-frontend/actions/workflows/ci.yml)

뽀득뽀득은 프론트엔드 3명·백엔드 3명이 함께 개발한 카카오 테크 캠퍼스 1기 팀 프로젝트입니다. 저는 사용자 프론트엔드의 예약 흐름과 API 연동을 맡았습니다. 저장소에는 당시 담당 기능과 이후 직접 보완한 내용이 함께 있으며, 아래는 제가 구현한 사용자 프론트엔드 범위입니다.

## 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 팀 프로젝트 기간 | 2023.09.14–2023.11.17 |
| 팀 구성 | 프론트엔드 3명 · 백엔드 3명 |
| 당시 담당 범위 | 사용자 예약 흐름 · API 연동 · 세차장 상세·리뷰·지도 UI 일부 |
| 이후 개인 보완 | 예약 규칙·오류 처리 · 테스트·CI · 반응형 UI · 재현 문서 |
| 프론트엔드 | React 18 · JavaScript · Redux Toolkit · TanStack Query · Vite |
| 백엔드 연동 | Spring Boot · MariaDB · REST API |
| 팀 성과 | 카카오 테크 캠퍼스 1기 신규 서비스 개발 프로젝트 대상 |

## 주요 기능 및 화면

<table>
  <tr>
    <td width="33.33%" align="center" valign="top">
      <img src="docs/assets/readme/01_nearby_search.png" alt="지도와 세차장 목록에서 주변 세차장을 조회하는 화면" width="100%" />
      <br /><sub>① 지도에서 세차장 조회</sub>
    </td>
    <td width="33.33%" align="center" valign="top">
      <img src="docs/assets/readme/02_reservation_time.png" alt="예약 날짜와 시작 시간, 이용 시간을 선택하는 화면" width="100%" />
      <br /><sub>② 날짜·시간·이용 시간 선택</sub>
    </td>
    <td width="33.33%" align="center" valign="top">
      <img src="docs/assets/readme/03_bay_selection.png" alt="예약 가능한 세차 베이를 선택하는 화면" width="100%" />
      <br /><sub>③ 예약 가능한 베이 선택</sub>
    </td>
  </tr>
</table>

## 기술 스택

### 핵심 기술

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?logo=javascript&logoColor=F7DF1E)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?logo=redux&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=tanstackquery&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

- **UI:** Tailwind CSS · React Hook Form · React Router
- **API 연동:** Axios · REST API · JWT 인증 · Kakao Maps SDK
- **검증 및 협업:** Testing Library · MSW · Storybook · ESLint · GitHub Actions
- **백엔드:** Spring Boot · MariaDB

## 주요 구현

- **예약 흐름:** 베이·날짜·시작 시간·이용 시간의 선택 상태를 관리하고, 상위 조건 변경 시 하위 선택값을 초기화했습니다.
- **시간 검증:** 영업시간·현재 시각·기존 예약을 반영해 예약 가능 시간을 계산하고, 경계 조건을 순수 함수와 테스트로 검증했습니다.
- **상태 관리:** 예약 선택은 Redux Toolkit, 서버 데이터는 TanStack Query로 관리하고 예약 변경 후 관련 캐시를 갱신했습니다.
- **API·결제:** 백엔드 API와 결제 준비·승인·실패 흐름을 연동했습니다. 로컬 통합 확인은 실제 결제사 대신 로컬 결제 구현을 사용합니다.
- **반응형 UI:** 모바일 중심 흐름을 유지하면서 PC에서는 고정 폭 레이아웃을 적용하고 지도·목록·인증·예약 화면을 정리했습니다.

## 트러블슈팅: 예약 조건 변경 후 선택값 불일치

- **문제:** 날짜나 시작 시간을 바꾼 뒤 이전 선택값이 남으면 예약 가능 시간·이용 시간·금액이 서로 맞지 않을 수 있었습니다.
- **원인:** 예약 단계가 서로 종속적이고 영업시간·현재 시각·기존 예약에 따라 선택 가능한 범위가 달라집니다.
- **해결:** 상위 조건 변경 시 하위 선택을 초기화하고, 시간 계산을 UI 밖의 순수 함수로 분리했습니다. 예약 구간은 반열린 구간(`[시작, 종료)`)으로 비교해 인접 예약은 허용하고 겹치는 예약은 차단합니다.
- **검증:** 예약 시간 테스트 24건으로 영업시간 경계, 현재 시각, 중복·인접 예약, 날짜 변경을 확인했습니다.

[예약 규칙 상세 기록](docs/refactoring.md)

## 검증 및 범위

| 검증 | 결과 |
|---|---|
| 프론트엔드 테스트 | **28개 파일 · 111개 통과** (예약 시간 규칙 24개 포함) |
| ESLint | 오류·경고 0건 |
| Production build | 통과 |
| GitHub Actions | push·pull request 시 테스트, lint, production/demo build, production dependency audit 실행 |
| 로컬 통합 확인 | 예약 흐름과 MariaDB 저장을 브라우저에서 확인 (로컬 결제 구현) |

실제 KakaoPay 운영 결제와 자동화된 전체 브라우저 E2E는 확인하지 않았습니다.

- **이미지 최적화:** 106,998B → 66,413B (37.9% 감소)
- **Lighthouse 모바일:** 2026-09-17 로컬 production preview, v12.6.1, 412×823, CPU 4배·모바일 네트워크 제한. 3회 중앙값: Performance 88 → 91, LCP 3,578 → 3,331ms.

## 실행 방법

```bash
npm ci
npm run dev
```

주요 검증 명령:

```bash
npm run lint
npm test -- --run
npm run build
```

- 실제 로컬 백엔드 연동: [전체 스택 재현 안내](docs/local-reproduction.md)
- 백엔드 없이 사용자 흐름 확인: `npm run dev:mock` (MSW 데모)
- 데모 빌드: `npm run build:demo:local` 후 `npm run preview:demo`

MSW 데모 계정과 결제는 로컬 확인 전용입니다. 데모 데이터는 메모리에 저장되어 새로고침하면 초기화되며, 실제 결제가 발생하지 않습니다.

## 관련 저장소 및 문서

- [사업자용 프론트엔드](https://github.com/minjuko/ppodeuk-owner-frontend) · [백엔드](https://github.com/minjuko/ppodeuk-backend)
- [시스템 구조와 구현 범위](docs/architecture.md) · [예약·결제 안정화 설계](docs/refactoring.md) · [로컬 전체 스택 재현](docs/local-reproduction.md) · [배포·운영 안내](docs/deployment-operations.md)
