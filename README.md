# 뽀득뽀득 — USER 프론트엔드

> 셀프세차장 탐색부터 세차 공간(Bay) 예약·결제·리뷰까지 제공하는 모바일 웹 서비스

[![CI](https://github.com/minjuko/ppodeuk-user-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/minjuko/ppodeuk-user-frontend/actions/workflows/ci.yml)
![Tests](https://img.shields.io/badge/Tests-106%20passed-2EA44F)

뽀득뽀득은 프론트엔드 3명·백엔드 3명이 개발한 팀 프로젝트입니다.  
저는 **사용자 예약 흐름과 API 연동**을 담당하고, 예약 규칙·결제 상태 처리와 테스트·CI를 보강했습니다.

## 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 기간 | 2023.09.14–2023.11.17 |
| 형태 | 카카오 테크 캠퍼스 1기 · 6인 팀 프로젝트 |
| 개인 역할 | 사용자용 프론트엔드 예약 흐름 · 세차장 상세·리뷰·지도 UI 일부 |
| 프론트엔드 | React 18 · JavaScript · Redux Toolkit · TanStack Query · Vite |
| 백엔드 | Spring Boot · MariaDB |
| 성과 | 카카오 테크 캠퍼스 1기 신규 서비스 개발 프로젝트 대상 |

## 주요 기능 및 화면

<table>
  <tr>
    <td width="50%" align="center" valign="top">
      <img src="docs/assets/readme/user/nearby/01_nearby_search.png" alt="지도 기반 주변 세차장 탐색 화면" width="100%" />
      <br /><sub>① 지도에서 주변 세차장 탐색</sub>
    </td>
    <td width="50%" align="center" valign="top">
      <img src="docs/assets/readme/user/nearby/02_carwash_detail.png" alt="세차장 상세정보 확인 화면" width="100%" />
      <br /><sub>② 세차장 상세정보 확인</sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center" valign="top">
      <img src="docs/assets/readme/user/reservation/02_schedule_selection.png" alt="예약 시간과 이용 시간 선택 화면" width="100%" />
      <br /><sub>③ 예약 시간 · 이용 시간 선택</sub>
    </td>
    <td width="50%" align="center" valign="top">
      <img src="docs/assets/readme/user/reservation/04_reservation_complete.png" alt="예약 완료 결과 화면" width="100%" />
      <br /><sub>④ 예약 완료 확인</sub>
    </td>
  </tr>
</table>

## 기술 스택

- **Frontend:** React 18 · JavaScript · Redux Toolkit · TanStack Query · Vite
- **Backend 연동:** Spring Boot · MariaDB · REST API
- **검증:** Jest · MSW · ESLint · GitHub Actions

## 담당 역할 및 핵심 구현

- **예약 상태 관리:** 세차 공간 → 날짜 → 시작 시간 → 이용 시간의 종속 선택값을 관리하고 상위 조건 변경 시 하위 값을 초기화했습니다.
- **예약 시간 검증:** 영업시간·기존 예약·30분 단위 이용 조건을 반영하고 시간 계산 로직을 순수 함수와 회귀 테스트로 분리했습니다.
- **상태 책임 분리:** 예약 선택 상태는 Redux Toolkit, 서버 데이터는 TanStack Query로 관리하고 예약 완료 후 관련 캐시를 갱신했습니다.
- **API·결제 연동:** API 계약과 MSW를 활용해 화면을 병렬 개발하고 결제 승인·실패·재시도 흐름을 처리했습니다.

## 실행 방법

```bash
npm ci
npm run dev
```

```bash
npm run lint
npm test -- --run
npm run build
```

백엔드 없이 사용자 흐름을 확인할 때는 `npm run dev:mock`으로 MSW 데모를 실행합니다. 데모 계정은 로컬 테스트 전용입니다. mock 결제는 실제 결제가 아니며 새로고침 시 데이터가 초기화됩니다.

- 개발 서버: `npm run dev` 또는 `npm run dev:mock` → `localhost:5173`
- 데모 미리보기: `npm run build:demo:local` 후 `npm run preview:demo` → `localhost:4173`
- 실제 로컬 백엔드 연동: [전체 스택 재현 안내](docs/local-reproduction.md)

## 테스트 및 검증

| 검증 | 결과 |
| --- | --- |
| 프론트엔드 테스트 | **28파일 · 106건 통과** |
| ESLint | 오류·경고 0건 |
| Production / Demo build | 통과 |
| GitHub Actions | CI workflow (`test → lint → production/demo build → production dependency audit`) |
| 이미지 최적화 | 106,998B → 66,413B (37.9% 감소) |
| Lighthouse 모바일 | 3회 중앙값 기준 Performance 88→91, LCP 3,578→3,331ms |

## 관련 문서

- [사업자용 프론트엔드](https://github.com/minjuko/ppodeuk-owner-frontend) · [백엔드](https://github.com/minjuko/ppodeuk-backend)
- [설계 문서](docs/architecture.md) · [예약 규칙과 개선 기록](docs/refactoring.md)

