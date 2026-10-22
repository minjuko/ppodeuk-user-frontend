import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { createMapLabel, loadKakaoMapsSdk } from "../../utils/kakaoMaps";
import Loader from "./Loader";

const KakaoMap = ({
  currentloc = { latitude: 33.450701, longitude: 126.570667 },
  className,
  mapdata = [],
}) => {
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
          center: new kakao.maps.LatLng(
            currentloc.latitude - 0.015,
            currentloc.longitude,
          ),
          level: 6,
          mapTypeId: kakao.maps.MapTypeId.ROADMAP,
        };

        const map = new kakao.maps.Map(container, options);

        new kakao.maps.CustomOverlay({
          map,
          position: new kakao.maps.LatLng(
            currentloc.latitude,
            currentloc.longitude,
          ),
          content: `<div class="current-location-marker" aria-label="현위치">
            <span class="current-location-dot"></span>
            <span class="current-location-label">현위치</span>
          </div>`,
          xAnchor: 0.5,
          yAnchor: 0.5,
          zIndex: 10,
        });

        mapdata.forEach((el) => {
          const position = new kakao.maps.LatLng(
            el.location.latitude,
            el.location.longitude,
          );
          new kakao.maps.CustomOverlay({
            map: map,
            position: position,
            content: createMapLabel(el?.name),
            yAnchor: 1,
            zIndex: 5,
          });
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
  }, [currentloc, mapdata]);

  return (
    <div className={`relative ${className ?? ""}`}>
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

KakaoMap.propTypes = {
  currentloc: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }),
  className: PropTypes.string,
  mapdata: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      location: PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
      }).isRequired,
    }),
  ),
};

export default KakaoMap;
