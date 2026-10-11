let sdkPromise;

export const loadKakaoMapsSdk = (appKey) => {
  if (!appKey) {
    return Promise.reject(new Error("Kakao Maps JavaScript key is missing."));
  }

  if (window.kakao?.maps) {
    return new Promise((resolve) => {
      window.kakao.maps.load(() => resolve(window.kakao));
    });
  }

  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(
        'script[data-kakao-maps-sdk="true"]',
      );
      const script = existingScript || document.createElement("script");

      const handleLoad = () => {
        if (!window.kakao?.maps) {
          sdkPromise = undefined;
          reject(new Error("Kakao Maps SDK did not initialize."));
          return;
        }

        window.kakao.maps.load(() => resolve(window.kakao));
      };

      const handleError = () => {
        sdkPromise = undefined;
        reject(new Error("Kakao Maps SDK could not be loaded."));
      };

      script.addEventListener("load", handleLoad, { once: true });
      script.addEventListener("error", handleError, { once: true });

      if (!existingScript) {
        script.async = true;
        script.dataset.kakaoMapsSdk = "true";
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(
          appKey,
        )}&autoload=false`;
        document.head.appendChild(script);
      }
    });
  }

  return sdkPromise;
};

export const createMapLabel = (text) => {
  const label = document.createElement("div");
  label.textContent = text || "";
  Object.assign(label.style, {
    position: "relative",
    padding: "5px 10px",
    background: "#0098FF",
    border: "2px solid #FFFFFF",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.35)",
    color: "#FFFFFF",
    fontSize: "12px",
    fontWeight: "700",
    textAlign: "center",
    whiteSpace: "nowrap",
  });

  return label;
};
