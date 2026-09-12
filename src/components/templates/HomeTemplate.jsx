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
import LogoIcon from "/bdbd_icon.svg";
import dayjs from "dayjs";

const HomeTemplate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [location, setLocation] = useState({
    latitude: 35.14,
    longitude: 126.9,
  });
  const selectedAt = dayjs(Date.now()).format("YYYY-MM-DDTHH:mm:ss");

  const { isLoggedIn, userName } = useSelector((state) => state.auth);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  }, []);

  const [recommended, recent] = useQueries({
    queries: [
      {
        queryKey: ["recommended", location.latitude, location.longitude],
        queryFn: () =>
          carwashesRecommended(location.latitude, location.longitude),
      },
      {
        queryKey: ["recent", selectedAt],
        queryFn: () => reservationsRecent(selectedAt),
        enabled: isLoggedIn,
      },
    ],
  });

  const recommendedData = recommended?.data?.data?.response?.[0];
  const recentList = recent?.data?.data?.response?.recentReservationList || [];

  return (
    <div className="relative grid-8">
      <nav className="items-center h-10 bg-white flex-between">
        <div className="flex items-center gap-2">
          <img src={LogoIcon} className="w-5 h-6" alt="뽀득뽀득 아이콘" />
          <img src="/bdbd.svg" className="w-24 h-auto" alt="뽀득뽀득" />
        </div>
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
      </nav>
      <h1 className="text-2xl font-bold break-keep">
        {userName ? (
          `${userName}님 안녕하세요!`
        ) : (
          <>
            여유롭게 즐기는 셀프세차,
            <span className="block">뽀득뽀득</span>
          </>
        )}
      </h1>
      <section className="gap-4 flex-between">
        <Link
          to="/reservation"
          className="relative flex items-start w-full h-[72px] p-4 overflow-hidden text-left bg-white border border-gray-300 shadow-xl break-keep rounded-xl"
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
          className="relative flex items-start w-full h-[72px] p-4 overflow-hidden text-left bg-white border border-gray-300 shadow-xl break-keep rounded-xl"
        >
          예약내역 보기
          <img
            className="absolute right-2 -bottom-4"
            src={ReservationHistory}
            alt="예약내역 아이콘"
          />
        </Link>
      </section>
      <section className="grid-4">
        <h2 className="text-xl font-semibold">이런 세차장 어때요?</h2>
        {recommended.isPending ? (
          <div role="status">추천 세차장을 불러오는 중입니다.</div>
        ) : recommended.isError ? (
          <div role="alert">추천 세차장을 불러오지 못했습니다.</div>
        ) : recommendedData ? (
          <CarwashCard
            id={recommendedData.id}
            image={recommendedData.image}
            name={recommendedData.name}
            address={recommendedData.location.address}
            rate={recommendedData.rate}
            reviewCount={recommendedData.reviewCount}
            distance={recommendedData.distance}
          />
        ) : (
          <div>현재 추천할 수 있는 세차장이 없습니다.</div>
        )}
      </section>
      {isLoggedIn && (
        <section className="grid-4">
          <h2 className="text-xl font-semibold">최근 이용 내역</h2>
          {recent.isPending ? (
            <div role="status">최근 이용 내역을 불러오는 중입니다.</div>
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
