import KakaoMap from "../atoms/KakaoMap";
import { Bottomsheet } from "../atoms/Bottomsheet";
import StoreItem from "../molecules/StoreItem";
import { useEffect, useState } from "react";
import { Badge } from "../atoms/Badge";
import DualBottomsheet from "../atoms/DualBottomsheet";
import { carwashesSearch } from "../../apis/carwashes";
import { useSuspenseQuery } from "@tanstack/react-query";
import TextInput from "../atoms/TextInput";
import { useDispatch } from "react-redux";
import { resetStore } from "../../store/action";
import { DEMO_LOCATION, isDemoMode } from "../../demo/mode";
import { FiSearch } from "react-icons/fi";
import { parseReservationRouteId } from "../../utils/reservationRoute";

const ReservationTemplate = () => {
  const dispatch = useDispatch();
  const initialKeypoints = [];
  const [keypoints, setKeypoints] = useState(initialKeypoints);
  const [firstClick, setFirstClick] = useState(true);
  const [location, setLocation] = useState(
    isDemoMode
      ? DEMO_LOCATION
      : {
          latitude: 35.14,
          longitude: 126.9,
        },
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(resetStore());
  }, [dispatch]);

  useEffect(() => {
    if (!isDemoMode && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  }, []);

  const { data } = useSuspenseQuery({
    queryKey: [
      "getcarwashes",
      location.latitude,
      location.longitude,
      keypoints,
    ],
    queryFn: () =>
      carwashesSearch(keypoints, location.latitude, location.longitude),
    enabled: location.latitude !== null && location.longitude !== null,
  });
  const carwashList = data;

  const handleBadgeClick = (value) => {
    if (firstClick) {
      setKeypoints([value]);
      setFirstClick(false);
    } else {
      setKeypoints((prevKeypoints) =>
        prevKeypoints.includes(value)
          ? prevKeypoints.filter((point) => point !== value)
          : [...prevKeypoints, value],
      );
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCarwashList = [...(carwashList?.data?.response || [])]
    .filter((item) => parseReservationRouteId(item?.id) !== null)
    .filter((item) => !searchTerm || item?.name.includes(searchTerm))
    .sort((a, b) => Number(a.distance) - Number(b.distance));

  return (
    <div className="reservation-map-page relative h-screen w-screen md:mx-auto md:h-[100dvh] md:w-full md:max-w-[560px] md:overflow-hidden">
      <KakaoMap
        currentloc={location}
        mapdata={carwashList?.data?.response}
        className="fixed inset-0 z-0 h-screen w-screen md:absolute md:h-full md:w-full"
      />

      <DualBottomsheet className="reservation-sheet fixed left-0 z-10">
        <Bottomsheet className="reservation-sheet-content z-20 flex h-full flex-col gap-2 p-4">
          <div className="relative">
            <TextInput
              type="text"
              id="search-bar"
              aria-label="세차장 이름 검색"
              placeholder="검색할 세차장 이름을 입력하세요"
              className="reservation-search-input w-full px-4 pr-11 border-gray-300"
              onChange={handleSearchChange}
              value={searchTerm}
            />
            <FiSearch
              className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 pointer-events-none right-4 top-1/2"
              aria-hidden="true"
            />
          </div>
          <div
            className="reservation-filters"
            role="group"
            aria-label="세차장 키포인트 필터"
            onPointerDownCapture={(event) => event.stopPropagation()}
            onTouchStartCapture={(event) => event.stopPropagation()}
          >
            <Badge
              key="8"
              label="하부세차"
              onClick={() => {
                handleBadgeClick(8);
              }}
              className="whitespace-nowrap"
            />
            <Badge
              key="9"
              label="개러지형 독립공간"
              onClick={() => {
                handleBadgeClick(9);
              }}
              className="whitespace-nowrap"
            />
            <Badge
              key="10"
              label="야간조명"
              onClick={() => {
                handleBadgeClick(10);
              }}
              className="whitespace-nowrap"
            />
            <Badge
              key="11"
              label="100% 수돗물"
              onClick={() => {
                handleBadgeClick(11);
              }}
              className="whitespace-nowrap"
            />
            <Badge
              key="12"
              label="휴게실"
              onClick={() => {
                handleBadgeClick(12);
              }}
              className="whitespace-nowrap"
            />
            <Badge
              key="13"
              label="에어컨"
              onClick={() => {
                handleBadgeClick(13);
              }}
              className="whitespace-nowrap"
            />
            <Badge
              key="14"
              label="발수코팅건"
              onClick={() => {
                handleBadgeClick(14);
              }}
              className="whitespace-nowrap"
            />
          </div>

          <div
            className="reservation-list carwash-list-scrollbar grid content-start flex-1 min-h-0 gap-3 overflow-y-auto overscroll-contain pb-16 touch-pan-y"
            onPointerDown={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
          >
            {filteredCarwashList?.length > 0 ? (
              filteredCarwashList.map((item) => (
                <StoreItem
                  key={item.id}
                  carwashId={item.id}
                  imgsrc={item.image}
                  storename={item.name}
                  starcount={item.rate}
                  priceinfo={item.price}
                  distance={item.distance}
                />
              ))
            ) : (
              <p className="text-gray-600">검색된 세차장이 없습니다.</p>
            )}
          </div>
        </Bottomsheet>
      </DualBottomsheet>
    </div>
  );
};

export default ReservationTemplate;
