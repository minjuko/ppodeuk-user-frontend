import { useEffect, useState } from "react";

export const DEFAULT_LOCATION = Object.freeze({
  latitude: 35.1472,
  longitude: 126.918,
});

const useGeoLocation = ({
  enableHighAccuracy = false,
  timeout = 8000,
  maximumAge = 300000,
} = {}) => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [error, setError] = useState("");
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("현재 위치를 지원하지 않아 기본 위치를 사용합니다.");
      setIsUsingFallback(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (
          Number.isFinite(coords.latitude) &&
          Number.isFinite(coords.longitude)
        ) {
          setLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
          setError("");
          setIsUsingFallback(false);
        }
      },
      () => {
        setError("현재 위치를 확인할 수 없어 광주 중심 위치를 사용합니다.");
        setIsUsingFallback(true);
      },
      { enableHighAccuracy, timeout, maximumAge },
    );
  }, [enableHighAccuracy, maximumAge, timeout]);

  return { location, error, isUsingFallback };
};

export default useGeoLocation;
