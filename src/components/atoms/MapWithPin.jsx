import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { createMapLabel, loadKakaoMapsSdk } from "../../utils/kakaoMaps";
import Loader from "./Loader";

const MapWithPin = ({ lat, lng, text, className }) => {
  const mapContainerRef = useRef(null);
  const [mapStatus, setMapStatus] = useState(
    import.meta.env.VITE_KAKAOMAP_API_KEY ? "loading" : "error",
  );

  useEffect(() => {
    if (!import.meta.env.VITE_KAKAOMAP_API_KEY) {
      setMapStatus("error");
      return;
    }

    let isCancelled = false;
    setMapStatus("loading");

    loadKakaoMapsSdk(import.meta.env.VITE_KAKAOMAP_API_KEY)
      .then((kakao) => {
        if (isCancelled) return;
        const container = mapContainerRef.current;
        if (!container) return;
        const options = {
          center: new kakao.maps.LatLng(lat, lng),
          level: 3,
          mapTypeId: kakao.maps.MapTypeId.ROADMAP,
        };
        const map = new kakao.maps.Map(container, options);
        const position = new kakao.maps.LatLng(lat, lng);

        new kakao.maps.CustomOverlay({
          map: map,
          position: position,
          content: createMapLabel(text),
          yAnchor: 1,
        });
        kakao.maps.event.addListener(map, "tilesloaded", () => {
          if (!isCancelled) setMapStatus("ready");
        });
        map.relayout();
      })
      .catch(() => {
        if (!isCancelled) setMapStatus("error");
      });

    return () => {
      isCancelled = true;
    };
  }, [lat, lng, text]);

  return (
    <div
      className={`relative h-72 overflow-hidden rounded-3xl ${className ?? ""}`}
    >
      <div ref={mapContainerRef} className="absolute inset-0 h-full w-full" />
      {mapStatus === "loading" && (
        <div className="absolute inset-0 z-[1] flex items-center justify-center bg-white/70">
          <Loader variant="inline" label="지도를 불러오는 중입니다." />
        </div>
      )}
      {mapStatus === "error" && (
        <div
          className="absolute inset-0 z-[1] flex items-center justify-center bg-gray-100 text-sm text-gray-600"
          role="status"
        >
          지도 정보를 불러올 수 없습니다.
        </div>
      )}
    </div>
  );
};

MapWithPin.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  text: PropTypes.string,
  className: PropTypes.string,
};

export default MapWithPin;
