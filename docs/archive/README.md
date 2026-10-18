# 보관 자료

이 폴더에는 현재 실행·배포 흐름에서는 사용하지 않는 과거 자료와 검증 캡처를 원본 그대로 보관합니다.

## Kubernetes 설정

[`k8s/`](./k8s/)에는 2023년 배포 준비 당시 매니페스트가 있습니다. 현재 공개 실행 환경은 Vercel이므로 배포에 사용하지 않습니다. `ingress.yaml`은 더 이상 권장되지 않는 `networking.k8s.io/v1beta1` API를 사용합니다. 원본 내용과 상대 경로를 보존하기 위해 한 폴더 안에 함께 둡니다.

## 로컬 검증 캡처

`validation-captures/`의 PNG는 2026-10-11 로컬 예약 흐름과 2026-08-12 KakaoMap 연동을 확인할 때 남긴 화면 증거입니다. README나 코드가 참조하는 런타임 자산은 아니며, 검증 이력 보존을 위해 이동했습니다.

- [예약·화면 캡처](./validation-captures/local-check/)
- [KakaoMap 캡처](./validation-captures/kakaomap/)

## 데모 이미지 원본

[`carwash-images-original/`](./carwash-images-original/)에는 데모용 세차장 이미지의 PNG 원본을 보존합니다. 현재 데모는 동일한 1536×1024 화면 이미지를 JPEG 품질 90으로 인코딩한 `public/carwash-*.jpg`를 사용합니다. 원본과 비교해 화면 구성을 유지하면서 전송 용량을 줄였으며, 원본 PNG는 검토·복구용으로 남겨 두었습니다.
