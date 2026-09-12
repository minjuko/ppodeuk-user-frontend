# 2026 USER Frontend Refactoring Notes

이 문서는 2023 팀 프로젝트 결과와 구분되는 2026 개인 개선 작업의 상세 근거를 정리합니다.

## Reservation Business Rules

예약 가능 시간 계산을 picker component에서 `src/utils/reservationTime.js`의 pure function으로 분리했습니다.

| 규칙 | 처리 | 검증 관점 |
|---|---|---|
| minute 단위 영업 시작 | `09:30`처럼 정각이 아닌 시작을 slot 경계로 사용 | opening boundary |
| 오늘의 과거 시간 | 현재보다 앞선 시작 시간 제외 | same-day clock |
| 기존 예약 overlap | `[start, end)` 구간으로 충돌 판단 | 포함·부분 포함·완전 포함 |
| 인접 예약 | 기존 종료와 새 시작이 같으면 허용 | end equals next start |
| 날짜 변경 | 선택했던 시작 시간 reset | stale state 방지 |
| 시작 시간 변경 | 선택했던 duration reset | 가격·종료 시각 불일치 방지 |
| cross-day datetime | 날짜와 시간을 결합한 datetime으로 비교 | 자정 경계 계산 |
| 영업 종료 | duration이 종료 시각을 넘지 않도록 제한 | closing boundary |

`src/utils/reservationTime.test.js`의 24개 regression test가 opening/closing, 현재 시각, overlap, 인접 예약, 날짜와 cross-day 경계를 다룹니다. 자정을 넘는 **예약 datetime 계산**은 검증하지만, `22:00–02:00`과 같은 **야간 영업시간 모델** 자체는 현재 UI 지원 범위가 아닙니다.

## Payment Lifecycle

브라우저 redirect 전후로 이어지는 결제는 단일 API 호출이 아니라 lifecycle로 다뤘습니다.

1. ready 성공 시에만 현재 결제의 `tid`를 보관합니다.
2. callback에서 `pg_token`과 이동 전 state를 검증합니다.
3. 직접 접근이나 잘못된 callback이면 approve하지 않고 stale `tid`를 제거합니다.
4. approve mutation 진행 중 완료 action을 비활성화해 중복 요청을 막습니다.
5. 실패 화면은 retry 가능한 경로를 제공하되 이전 callback을 성공으로 간주하지 않습니다.
6. approve 결과와 예약 완료 화면이 확인된 뒤 예약 Redux state를 reset합니다.
7. 예약 취소·변경 뒤에는 page reload 대신 관련 React Query cache를 invalidate합니다.

PaymentWaiting, PaymentResult, store와 reservation item tests로 direct access, callback 누락, 중복 approve 방지, fallback, reset/invalidate를 확인했습니다. production KakaoPay E2E는 2026 검증 범위가 아닙니다.

## Runtime and Cache Stability

- API 화면에 loading/error/empty state를 명시했습니다.
- 누락된 image, list, navigation state와 callback result의 undefined/null을 방어했습니다.
- 제출·결제·예약 mutation 진행 중 중복 interaction을 차단했습니다.
- 위치별 query key를 구분하고, mutation 이후 관련 query만 invalidate했습니다.
- button semantic과 일부 keyboard interaction을 보완했습니다.
- 모든 route page를 `React.lazy`로 분리하고 공통 `Suspense` fallback을 사용했습니다.

## Test Matrix

| 영역 | 테스트 수 | 대표 검증 |
|---|---:|---|
| Reservation time pure functions | 24 | minute boundary, now, overlap, adjacent, cross-day |
| Stateful Demo flow | 8 | login, lookup, payment, history, cancel, review, fail-closed |
| Demo mode boundary | 2 | worker start, Live 미로드 |
| Store | 6 | reservation/payment state lifecycle |
| Signup | 5 | Backend password contract, async mutation |
| UI/runtime regression | 16 | picker reset, payment callback/result, empty/error/null, keyboard |
| **합계** | **74** | **18 test files** |

실행 명령은 `npm test`이며, 최종 검증 결과 18 files / 74 tests가 통과했습니다.
