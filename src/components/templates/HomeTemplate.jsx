import { useQueries, useQueryClient } from "@tanstack/react-query";
import { Button } from "../atoms/Button";
import { CarwashCard } from "../molecules/CarwashCard";
import { RecentCarwashSlider } from "../organisms/RecentCarwashSlider";
import Reservation from "/Button/home/reservation.svg";
import ReservationHistory from "/Button/home/reservationHistory.svg";
import { carwashesRecommended } from "../../apis/carwashes";
import { reservationsRecent } from "../../apis/reservations";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { resetStore } from "../../store/action";
import AppTopBar from "../atoms/AppTopBar";
import Loader from "../atoms/Loader";
import {
  DEMO_LOCATION,
  FALLBACK_RECOMMENDED_CARWASH,
  isDemoMode,
} from "../../demo/mode";

const HomeTemplate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [location, setLocation] = useState(DEMO_LOCATION);
  const { isLoggedIn, userName } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isDemoMode && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => setLocation(DEMO_LOCATION),
        { timeout: 5000, maximumAge: 300000 },
      );
    }
  }, []);

  const [recommended, recent] = useQueries({
    queries: [
      {
        queryKey: ["recommended", location.latitude, location.longitude],
        queryFn: () =>
          carwashesRecommended(location.latitude, location.longitude),
        enabled:
          Number.isFinite(location.latitude) &&
          Number.isFinite(location.longitude),
      },
      {
        queryKey: ["recent"],
        queryFn: reservationsRecent,
        enabled: isLoggedIn,
      },
    ],
  });

  const apiRecommendedData = recommended?.data?.data?.response?.[0];
  const recommendedData = apiRecommendedData ?? FALLBACK_RECOMMENDED_CARWASH;
  const recentList = recent?.data?.data?.response?.recentReservationList || [];

  return (
    <div className="home-content relative grid gap-5 md:grid-cols-1 md:gap-5">
      <AppTopBar className="col-span-full bg-white">
        <div className="contents">
          <img src="/bdbd.svg" className="hidden" alt="뽀득뽀득 로고" />
          {isLoggedIn ? (
            <Button
              onClick={() => {
                dispatch(logout());
                dispatch(resetStore());
                queryClient.removeQueries({ queryKey: ["recent"] });
              }}
            >
              로그아웃
            </Button>
          ) : (
            <Button
              onClick={() => {
                navigate("/login");
              }}
            >
              로그인
            </Button>
          )}
        </div>
      </AppTopBar>
      <h1 className="col-span-full text-2xl font-bold break-keep md:text-2xl">
        {userName ? (
          `${userName}님 안녕하세요!`
        ) : (
          <>
            여유롭게 즐기는 셀프세차,
            <span className="block">뽀득뽀득</span>
          </>
        )}
      </h1>
      <section className="col-span-full gap-3 flex-between md:justify-start">
        <Link
          to="/reservation"
          className="relative flex items-start w-full h-[72px] p-3 overflow-hidden text-left bg-white border border-gray-300 shadow-xl break-keep rounded-xl"
        >
          내 주변 세차장 예약하기
          <img
            className="absolute right-2 -bottom-4"
            src={Reservation}
            alt="위치 아이콘"
          />
        </Link>
        <Link
          to="/history"
          className="relative flex items-start w-full h-[72px] p-3 overflow-hidden text-left bg-white border border-gray-300 shadow-xl break-keep rounded-xl"
        >
          예약내역 보기
          <img
            className="absolute right-2 -bottom-4"
            src={ReservationHistory}
            alt="예약내역 아이콘"
          />
        </Link>
      </section>
      <section
        className={`grid content-start self-start gap-3 ${
          isLoggedIn
            ? "md:col-span-1"
            : "md:col-span-2 md:mx-auto md:w-full md:max-w-2xl"
        }`}
      >
        <h2 className="text-xl font-semibold">이런 세차장 어때요?</h2>
        {recommended.isPending && (
          <Loader variant="inline" label="추천 세차장을 불러오는 중입니다." />
        )}
        {recommended.isError && (
          <p className="text-sm text-gray-500">
            추천 정보를 불러오지 못해 예시 세차장을 표시하고 있습니다.
          </p>
        )}
        {!recommended.isPending && (
          <CarwashCard
            id={recommendedData.id}
            image={recommendedData.image}
            name={recommendedData.name}
            address={recommendedData.location.address}
            rate={recommendedData.rate}
            reviewCount={recommendedData.reviewCount}
            distance={recommendedData.distance}
          />
        )}
      </section>
      {isLoggedIn && (
        <section className="grid content-start self-start gap-3 md:col-span-1">
          <h2 className="text-xl font-semibold">최근 이용 내역</h2>
          {recent.isPending ? (
            <Loader
              variant="inline"
              label="최근 이용 내역을 불러오는 중입니다."
            />
          ) : recent.isError ? (
            <div role="alert">최근 이용 내역을 불러오지 못했습니다.</div>
          ) : recentList.length === 0 ? (
            <div className="text-center ">최근 이용 내역이 없습니다.</div>
          ) : (
            <RecentCarwashSlider recentList={recentList} />
          )}
        </section>
      )}
    </div>
  );
};
export default HomeTemplate;
