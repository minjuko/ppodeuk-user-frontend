import ReservationItem from "../molecules/ReservationItem";
import { useSuspenseQuery } from "@tanstack/react-query";
import { reservationsCurrentstatus } from "../../apis/reservations";
import { Button } from "../atoms/Button";
import { useNavigate } from "react-router-dom";
import LogoIcon from "/bdbd_icon.svg";

const ReservationHistoryTemplate = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["getHistory"],
    queryFn: reservationsCurrentstatus,
  });

  const navigate = useNavigate();

  const currentReservations =
    data?.data?.response?.currentReservationList || [];
  const upcomingReservations =
    data?.data?.response?.upcomingReservationList || [];
  const completedReservations =
    data?.data?.response?.completeReservationList || [];

  return (
    <div className="min-h-screen pb-20 bg-white">
      <nav className="items-center h-10 bg-white flex-between">
        <div className="flex items-center gap-2">
          <img src={LogoIcon} className="w-5 h-6" alt="뽀득뽀득 아이콘" />
          <img src="/bdbd.svg" className="w-24 h-auto" alt="뽀득뽀득" />
        </div>
      </nav>
      <header className="px-4 py-3 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold">예약 내역</h1>
      </header>

      <main className="grid gap-6 px-4 py-5">
        <section className="grid gap-3" aria-labelledby="current-reservations">
          <div className="flex items-center justify-between">
            <h2 id="current-reservations" className="text-lg font-semibold">
              이용 중
            </h2>
            <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">
              {currentReservations.length}건
            </span>
          </div>
          {currentReservations.length === 0 ? (
            <div className="px-3 py-5 text-sm text-center text-gray-500 border border-gray-200 border-dashed rounded-lg bg-gray-50">
              현재 이용 중인 세차가 없습니다.
            </div>
          ) : (
            currentReservations.map((reservation) => (
              <ReservationItem
                key={reservation.id}
                rsvid={reservation.id}
                carwashid={reservation.carwashId}
                imgsrc={
                  reservation.image
                    ? reservation.image.url
                    : "/CarwashDetail/CarwashImgNotFound.png"
                }
                reservedTime={reservation.time}
                bayname={`${reservation.carwashName}: 베이${reservation.bayNum}`}
                priceinfo={reservation.price}
              />
            ))
          )}
        </section>

        <section className="grid gap-3" aria-labelledby="upcoming-reservations">
          <div className="flex items-center justify-between">
            <h2 id="upcoming-reservations" className="text-lg font-semibold">
              예약 예정
            </h2>
            <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">
              {upcomingReservations.length}건
            </span>
          </div>
          {upcomingReservations.length ? (
            upcomingReservations.map((reservation) => (
              <ReservationItem
                key={reservation.id}
                carwashid={reservation.carwashId}
                rsvid={reservation.id}
                imgsrc={
                  reservation.image
                    ? reservation.image.url
                    : "/CarwashDetail/CarwashImgNotFound.png"
                }
                reservedTime={reservation.time}
                bayname={`${reservation.carwashName}: 베이${reservation.bayNum}`}
                priceinfo={reservation.price}
                buttontype="cancel"
              />
            ))
          ) : (
            <div className="grid gap-4 px-4 py-6 text-sm text-center text-gray-500 border border-gray-200 border-dashed rounded-lg bg-gray-50">
              <p>예정된 세차가 없습니다. 새로운 예약을 시작해보세요.</p>
              <Button
                variant="long"
                className="rounded-lg"
                onClick={() => navigate("/reservation")}
              >
                예약하러 가기
              </Button>
            </div>
          )}
        </section>

        <section
          className="grid gap-3"
          aria-labelledby="completed-reservations"
        >
          <div className="flex items-center justify-between">
            <h2 id="completed-reservations" className="text-lg font-semibold">
              이용 완료
            </h2>
            <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">
              {completedReservations.length}건
            </span>
          </div>
          {completedReservations.length === 0 ? (
            <div className="px-3 py-5 text-sm text-center text-gray-500 border border-gray-200 border-dashed rounded-lg bg-gray-50">
              완료된 세차 내역이 없습니다.
            </div>
          ) : (
            completedReservations.map((reservation) => (
              <ReservationItem
                key={reservation.id}
                carwashid={reservation.carwashId}
                rsvid={reservation.id}
                imgsrc={
                  reservation.image
                    ? reservation.image.url
                    : "/CarwashDetail/CarwashImgNotFound.png"
                }
                reservedTime={reservation.time}
                bayname={`${reservation.carwashName}: 베이${reservation.bayNum}`}
                priceinfo={reservation.price}
                buttontype="review"
                reviewed={
                  reservation.reviewed ??
                  reservation.reviewWritten ??
                  reservation.hasReview ??
                  false
                }
              />
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default ReservationHistoryTemplate;
