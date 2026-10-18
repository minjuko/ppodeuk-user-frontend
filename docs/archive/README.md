# 보관 자료

이 폴더에는 현재 실행·배포 흐름에서는 사용하지 않는 과거 자료와 검증 캡처를 원본 그대로 보관합니다.

## Kubernetes 설정

[`k8s/`](./k8s/)에는 2023년 배포 준비 당시 매니페스트가 있습니다. 현재 공개 실행 환경은 Vercel이므로 배포에 사용하지 않습니다. `ingress.yaml`은 더 이상 권장되지 않는 `networking.k8s.io/v1beta1` API를 사용합니다. 원본 내용과 상대 경로를 보존하기 위해 한 폴더 안에 함께 둡니다.

## 로컬 검증 캡처

`validation-captures/`의 PNG는 2026-10-11 로컬 예약 흐름과 2026-08-12 KakaoMap 연동을 확인할 때 남긴 화면 증거입니다. README나 코드가 참조하는 런타임 자산은 아니며, 검증 이력 보존을 위해 이동했습니다.

- [예약·화면 캡처](./validation-captures/local-check/)
- [KakaoMap 캡처](./validation-captures/kakaomap/)
