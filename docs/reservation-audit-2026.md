# 예약 흐름의 상태 관리와 API 검증

사용자용 프론트엔드의 예약 단계별 상태, 서버 검증 경계와 예외 처리를 코드·테스트 기준으로 정리했습니다. 자동화 테스트로 확인하지 않은 운영 동작은 별도로 구분합니다.

## A. 예약 단계별 상태 의존성

| 단계 | 컴포넌트 | 기준 상태와 전달 | API / 응답 | 검증·초기화 |
|---|---|---|---|---|
| 세차장 탐색 | `ReservationTemplate.jsx` | 검색어·위치·키워드는 local state | `carwashesSearch` → `response[]` | 예약 페이지 진입 시 Redux `RESET_STORE` |
| 세차장 상세 | `CarwashDetailTemplate.jsx` | `carwashId`는 URL parameter | `carwashesInfo` → 세차장·영업시간 | Bay 선택 화면으로 URL ID 전달 |
| Bay·날짜 선택 | `BaySelectionTemplate.jsx` | `carwashId`는 URL, 날짜는 local state, Bay는 클릭 시 Redux | `carwashesInfo`, `carwashesBays` → `bayList[].bayBookedTimeList` | Bay 변경 시 reducer가 예약 시간·결제 TID 초기화 |
| 시작 시각 | `ScheduleTemplate.jsx` / `TimePicker.jsx` | 날짜·시작 시각은 local state, 세차장·Bay ID는 URL을 Redux에 동기화 | 위 두 조회를 query key에 ID와 함께 사용 | 날짜 변경 시 시작·이용 시간 초기화. 과거·30분 slot·기존 예약 30분 겹침 비활성화 |
| 이용 시간 | `DurationPicker.jsx` | local state | 별도 API 없음 | 시작 시각 변경 시 이용 시간 초기화. 종료 시각·전체 구간 겹침 검증 |
| 예약 확인 | `ScheduleTemplate.jsx` | `buildReservationPayload`로 `bayId/startTime/endTime` 생성 | 별도 API 없음 | 시작 시각과 이용 시간이 모두 있어야 진행 |
| 금액 계산 | `PaymentTemplate.jsx` | Redux 예약 구간·Bay ID | `POST /api/user/carwashes/{bayId}/payment` → `response.price` | 서버 응답 금액만 결제 버튼에 사용. 실패 시 modal |
| 결제 준비 | `PaymentTemplate.jsx` | Redux ID·예약 구간·서버 가격 | `POST /api/user/payment/ready` → `tid`, redirect URL | 필수 Redux 상태, 응답 필드, pending 상태 확인 |
| 결제 승인·예약 생성 | `PaymentWaitingTemplate.jsx` | URL `pg_token` + Redux `tid`, ID, 시간 | `POST /api/user/payment/approve` → 예약 결과 | callback 상태 검증, 성공 후 Redux reset |

실제 기준값은 하나가 아니다. 라우트 식별자는 URL, 화면 안의 임시 선택은 local state, 화면 간 결제 lifecycle은 persist된 Redux가 기준이다. 서버가 소유하는 세차장·Bay·기존 예약·가격은 TanStack Query/API 응답이 기준이다.

## B. 예약 예외 조건별 검증 책임

| 조건 | Frontend | Backend | 테스트·판정 |
|---|---|---|---|
| 일반 영업시간 | 해당 날짜의 weekday/weekend period로 slot·duration 제한 | 가격 조회, ready, approve/save에서 영업시간 재검증 | FE `reservationTime.test.js`, BE `ReservationDateTimeRegressionTest` |
| 24시간 운영 | `00:00~00:00`을 `00:00~24:00`, 48 slot으로 정규화 | 시작·종료가 모두 자정인 영업시간은 24시간으로 허용 | FE/BE 회귀 테스트 존재 |
| 영업 종료 초과 | duration 비활성화 | 최종 거부 | FE 회귀 테스트 존재, BE 공통 검증 존재 |
| 날짜 변경 예약 | datetime 계산 함수는 다음 날짜를 정확히 생성 | 24시간 매장은 cross-day 허용 | FE 계산 테스트와 BE 가격 테스트 존재. 현재 UI는 23:30+60분을 선택지에서 제외하므로 UI 경로는 지원하지 않음 |
| 최소 이용 시간 | 제공 선택지의 최솟값 30분 | 30분 미만 거부 | BE 로직 확인. FE는 선택지 구조로 제한 |
| 30분 단위 | 30분 slot과 정해진 duration 목록 | 시작·종료 minute 및 duration 배수 재검증 | FE/BE 확인 |
| 기존 예약 겹침 | Bay 조회 응답으로 `[start,end)` 겹침을 표시·비활성화 | 같은 Bay 전체 회원 및 같은 회원 예약을 가격/결제/저장 단계에서 재검증 | FE overlap 테스트, BE 타 회원 동일 Bay 테스트 존재 |
| 가능한 시간 없음 | slot 전체 비활성화 또는 영업 종료 안내, 결제 진행 불가 | 유효하지 않은 구간 거부 | 부분 테스트만 존재. 전용 empty-state 통합 테스트는 **미확인** |
| 금액 재계산 | 사용자가 계산하지 않고 서버 가격 API 결과 표시 | 세차장 30분 단가로 계산하고 ready 요청 금액과 비교 | BE 가격 테스트 존재. 운영 결제 E2E는 **미확인** |
| 상위 선택 변경 | 세차장→Bay/시간/TID, Bay→시간/TID, 날짜→시작/이용 시간, 시작→이용 시간 reset | 요청 자체를 최종 검증 | reducer·picker 테스트 존재 |

Frontend의 겹침 표시는 조회 시점의 UX 검증일 뿐 예약 확정이 아니다. Backend도 현재 조회 후 저장을 DB lock/constraint로 직렬화하지 않으므로 동시 예약 충돌 방지는 **미보장**이다.

## C. Frontend·Backend API 책임

| 기능 | Frontend 책임 | Backend 책임·근거 |
|---|---|---|
| 예약 가능 정보 | `carwashesBays` 응답의 예약 구간을 slot에 반영 | `OpenReservationController` / `ReservationService.findAllByCarwash`가 Bay와 현재 예약 반환 |
| 기존 예약 조회 | 공개 Bay 응답과 예약 내역 API를 화면에 표현 | 삭제되지 않은 예약 조회·회원별 내역 분류 |
| 예약 생성 | 결제 승인 payload에 `saveDTO` 전달 | `PayService.requestPaymentApproval` 성공 후 `ReservationService.save` |
| 금액 | 예약 구간 전송, 응답 가격 표시 | `findPayAmount`가 유효성 검사 후 단가×30분 block 계산 |
| 결제 준비 | 서버 가격을 `total_amount`로 전달, redirect 처리 | 시간·겹침·금액 재검증 후 KakaoPay ready |
| 결제 승인 | `pg_token`, `tid`, 예약 payload 전달 | 승인 직전 재검증, 외부 승인 성공 뒤 예약 저장 |
| 오류 | query error boundary, mutation modal, 5초 Axios timeout | 표준 error body/status 반환. FE의 `getErrorDetail`은 알려진 일부 코드만 구체화 |

## D. 주요 개선 사례

| 문제 | 개선 및 검증 |
| --- | --- |
| 시간 규칙이 여러 화면에 분산 | 영업시간·30분 단위·예약 겹침·자정 계산을 순수 함수로 분리하고 회귀 테스트 추가 |
| 결제 callback 직접 접근·상태 누락 | 필수값 확인, 중복 요청 방어, 실패 후 재시도와 완료 후 상태 초기화 |
| 날짜 재선택 후 이전 시간 유지 | 날짜 변경 시 시작 시각·이용 시간 초기화 |
| 직접 일정 URL 접근 시 예약 정보 누락 | URL의 세차장·Bay 식별자를 공유 상태에 동기화하고 회귀 테스트 추가 |

## E. 검증 범위와 남은 과제

- 프론트엔드는 조회된 예약을 기준으로 선택 가능한 시간을 안내하고, 최종 유효성·금액·예약 가능 여부는 서버에서 다시 확인합니다.
- 24시간 운영 매장에서도 현재 UI는 자정을 넘어가는 이용 시간 선택을 제한합니다. 자정을 가로지르는 영업시간 모델은 추가 검증이 필요합니다.
- DB 잠금·제약을 통한 동시 예약 직렬화와 외부 결제 승인 후 예약 저장 실패에 대한 보상 처리는 보장되지 않습니다.
- 운영 결제·운영 DB를 사용하는 전체 E2E는 별도 검증 대상입니다.
