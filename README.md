뽀득뽀득

위치 기반 셀프세차장 탐색부터 Bay 예약, 결제, 리뷰까지 연결한 모바일 웹 기반 셀프세차장 예약 서비스

뽀득뽀득은 Kakao Tech Campus에서 6명이 개발한 팀 프로젝트입니다.
사용자는 주변 세차장을 탐색하고 Bay → 날짜 → 시작 시간 → 이용 시간을 선택해 예약할 수 있으며, 결제·예약 관리·리뷰 작성까지 하나의 사용자 흐름으로 제공합니다.

저는 USER Frontend의 예약 흐름을 중심으로 구현했으며, 프로젝트 종료 후 포트폴리오 정리 과정에서 예약·결제 안정화, Regression Test, Stateful MSW Demo, Full-stack 재현 및 배포 환경을 보완했습니다.






<p align="center"> <img src="./docs/assets/readme/user/reservation/reservation_flow.png" alt="Bay 선택부터 예약 시간, 결제, 예약 완료까지의 사용자 흐름" width="92%"> </p> <p align="center"><sub>Bay 선택 · 예약 시간 선택 · 결제 · 예약 완료</sub></p>
Project Overview
항목	내용
프로젝트	뽀득뽀득
기간	2023.09.25 ~ 2023.11.11
팀 구성	Frontend 3명 · Backend 3명
서비스	셀프세차장 탐색 · 예약 · 결제 · 리뷰
Frontend	React 기반 USER / OWNER 모바일 웹
Backend	Spring Boot · MariaDB
주요 역할	USER Frontend의 Bay·예약 선택 흐름 및 일부 서비스 UI
이후 개선	예약·결제 안정화 · 테스트 보강 · Demo 및 배포 환경 복원

서비스는 고객용 USER와 사업자용 OWNER로 분리되어 있으며 동일한 Spring Boot API와 MariaDB를 사용합니다.

Key Features
1. 위치 기반 세차장 탐색

현재 위치와 검색 조건을 기반으로 주변 세차장을 탐색합니다. 상세 화면에서 위치, 운영 정보, 편의시설, 리뷰를 확인한 뒤 예약으로 이동합니다.

<p align="center"> <img src="./docs/assets/readme/user/nearby/nearby_flow.png" alt="주변 세차장 탐색, 세차장 상세와 리뷰 조회" width="92%"> </p> <p align="center"><sub>주변 세차장 탐색 · 상세 정보 · 리뷰 조회</sub></p>
2. Bay 기반 예약

세차장을 선택한 뒤 Bay별 예약 현황을 확인하고 날짜, 30분 단위 시작 시간과 이용 시간을 순차적으로 선택합니다.

영업시간과 기존 예약을 기준으로 실제 선택 가능한 시간 조합만 제공하며, 최종 예약 조건은 Backend에서 다시 검증합니다.

3. 결제 및 예약 관리

예약 시간에 따른 금액을 확인한 뒤 결제를 진행합니다. 완료된 예약은 예약 내역에 반영되며 사용자는 현재·예정·완료 예약을 확인하고 가능한 예약을 취소할 수 있습니다.

<p align="center"> <img src="./docs/assets/readme/user/payment/payment_flow.png" alt="결제 진행과 예약 완료 결과" width="72%"> </p> <p align="center"><sub>결제 진행 · 예약 완료</sub></p>
4. 리뷰

이용이 완료된 예약에서 별점, 키워드, 내용을 입력해 리뷰를 등록할 수 있습니다.

<p align="center"> <img src="./docs/assets/readme/user/review/review_flow.png" alt="리뷰 작성과 등록 완료 흐름" width="92%"> </p> <p align="center"><sub>리뷰 작성 · 키워드 선택 · 등록 완료</sub></p>
5. OWNER Management

OWNER Frontend에서는 세차장 등록, 영업정보·Bay 관리, 예약 현황 및 매출 조회 기능을 제공합니다.

<p align="center"> <img src="./docs/assets/readme/owner/store_management/store_management_flow.png" alt="OWNER 대시보드, 매장 일정과 Bay 관리" width="92%"> </p>
Architecture

현재 포트폴리오 배포 환경은 USER·OWNER Frontend를 Vercel, Spring Boot Backend와 MariaDB를 Railway에 구성했습니다. 기존 서비스의 핵심 API 및 도메인 구조는 유지합니다.

Tech Stack
Category	Stack
Frontend	React 18, JavaScript, Vite, React Router
State	Redux Toolkit, Redux Persist, TanStack React Query
UI / Form	Tailwind CSS, React Spring, React Hook Form
HTTP / Date	Axios, Day.js
Map	Kakao Maps JavaScript SDK
Test / Demo	Vitest, React Testing Library, MSW
Backend	Spring Boot, Spring Data JPA
Database	MariaDB
External	KakaoPay, Object Storage
Deployment	Vercel, Railway
My Contribution
USER Frontend — Main Contribution

예약 경험을 중심으로 USER Frontend 구현에 참여했습니다.

Bay 선택 → 날짜 → 시작 시간 → 이용 시간으로 이어지는 예약 UI 구현
영업시간 및 Bay별 기존 예약을 반영한 예약 선택 흐름 구성
예약 단계 간 공유 State 연결
Schedule, TimeSlot, DurationPicker 등 예약 UI 구현 참여
세차장 상세·리뷰·Kakao Map UI 일부 구현
예약 State와 결제 UI를 연결하는 일부 Frontend 흐름 참여

USER Frontend 전체 또는 KakaoPay 결제 시스템 전체를 단독 구현한 것은 아닙니다.

OWNER Frontend — Supporting Contribution

세차장 등록 화면의 초기 구조와 일부 입력 UI 구현에 참여했습니다.

30분 단위 운영시간 입력
24시간 영업 옵션
이미지 선택·미리보기·삭제
Badge 기반 세차장 키포인트 선택
일부 Atom UI 초기 구현

Dashboard, Sales, Bay·예약 관리 및 Backend Upload는 개인 구현 범위에 포함하지 않습니다.

Project Maintenance & Improvement

프로젝트 종료 후 기존 코드를 다시 분석하고 다음 범위를 개인적으로 보완했습니다.

예약 시간 계산을 Pure Function으로 분리
날짜·시작 시간 변경에 따른 종속 State Reset
Cross-day 예약 Datetime 경계 처리
결제 Callback 및 State Lifecycle 안정화
React Query Cache Invalidation 및 중복 Mutation 방지
Loading / Error / Empty 및 Null 방어
Route-level Lazy Loading
Stateful MSW Portfolio Demo
Spring Boot · MariaDB Local Full-stack 재현
Vercel · Railway 기반 Demo 배포
Key Improvements
Reservation Reliability

예약 시간 계산을 Component 내부 로직에서 분리하고 다음 조건을 일관된 함수로 검증하도록 개선했습니다.

영업 시작·종료 경계
당일 과거 시간
기존 예약 Overlap
인접 예약
Duration
Cross-day Datetime

예약 시간 계산은 24개의 Regression Test로 검증했습니다.

Payment Lifecycle

결제 Redirect 전후의 상태를 하나의 Lifecycle로 정리했습니다.

Ready
→ TID
→ Redirect
→ Callback Validation
→ Approve
→ Reservation Complete
→ State Reset

잘못된 Callback, stale tid, 중복 요청 및 실패 후 Retry 상태를 보완했습니다.

Performance & Runtime Stability

Route-level Lazy Loading을 적용해 초기 Main JavaScript Bundle 크기를 감소시켰습니다.

Metric	Before	After	Reduction
Main JavaScript	528.08 kB	302.68 kB	42.68%
gzip	177.45 kB	98.78 kB	44.33%

또한 Loading / Error / Empty State, Null 방어, Query Cache 갱신 및 Kakao Maps SDK Loader를 정리했습니다.

Testing
검증	결과
Frontend Tests	73 / 73 passed
Test Files	18 / 18 passed
Reservation Regression	24 / 24 passed
Live Production Build	Passed
Demo Production Build	Passed

Backend Local Full-stack 복원 과정에서는 Frontend Test Suite와 별도로 19개의 Backend Regression Test를 추가해 Local Payment와 Reservation Datetime 경계를 검증했습니다.

Portfolio Demo

프로젝트 종료 이후 두 가지 검증 환경을 구성했습니다.

Stateful Frontend Demo

Spring Boot 없이도 다음 사용자 흐름을 재현할 수 있도록 MSW 기반 Stateful Demo를 구성했습니다.

로그인
→ 세차장 탐색
→ 예약
→ Fake Payment
→ 예약 내역
→ 예약 취소
→ 리뷰

기존 Component와 API Service는 유지하고 Axios 아래의 Backend 계층만 MSW로 대체했습니다.

Full-stack Demo

실제 Spring Boot와 MariaDB를 사용하는 배포 환경도 별도로 구성했습니다.

USER / OWNER — Vercel
        ↓
Spring Boot — Railway
        ↓
MariaDB — Railway

Demo 세차장, 예약, 리뷰 및 이미지를 포함한 재현용 Dataset을 사용합니다.

Documentation

구현 세부사항은 별도의 기술 Case Study에서 정리했습니다.

프로젝트 개요 및 요구사항
Frontend 구조와 상태·데이터 흐름
시스템 아키텍처와 API
예약 핵심 구현
트러블슈팅과 기술적 의사결정
테스트 및 성능·보안·UX 개선
협업 및 개발 프로세스
프로젝트 이후 개선 및 배포 복원

Repository 내부 기술 문서:

Architecture Notes
Refactoring Notes
Local Full-stack Reproduction
2023 Original README
Known Limitations
Stateful MSW Demo 데이터는 새로고침 시 초기화됩니다.
Demo Payment는 실제 KakaoPay 결제가 아닙니다.
Production 수준의 동시 예약 제어는 추가적인 Backend 동시성 처리가 필요합니다.
OWNER의 일부 Mutation 및 Object Storage 연동은 Portfolio Demo 검증 범위에 포함하지 않았습니다.
Team

Kakao Tech Campus 1기 3단계에서 Frontend 3명, Backend 3명이 함께 개발했습니다.

Frontend	Backend
노주영 · 김좌훈 · 고민주	김명지 · 김철호 · 이유진
