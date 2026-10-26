import { Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScheduleTemplate from "../components/templates/ScheduleTemplate";
import { GeneralErrorBoundary } from "../components/atoms/GeneralErrorBoundary";
import SectionSkeleton from "../components/feedback/SectionSkeleton";
import { Button } from "../components/atoms/Button";
import { parseReservationRouteId } from "../utils/reservationRoute";

const SchedulePage = () => {
  const navigate = useNavigate();
  const { carwashId, bayId } = useParams();
  const parsedCarwashId = parseReservationRouteId(carwashId);
  const parsedBayId = parseReservationRouteId(bayId);
  if (parsedCarwashId === null || parsedBayId === null) {
    return (
      <main className="grid min-h-screen place-content-center gap-4 p-6 text-center">
        <p role="alert">유효하지 않은 세차장 또는 베이 정보입니다.</p>
        <Button onClick={() => navigate("/reservation")}>예약 다시 시작</Button>
      </main>
    );
  }

  return (
    <GeneralErrorBoundary navigate={navigate}>
      <Suspense
        fallback={
          <SectionSkeleton rows={5} label="예약 일정을 불러오는 중입니다." />
        }
      >
        <ScheduleTemplate carwashId={parsedCarwashId} bayId={parsedBayId} />
      </Suspense>
    </GeneralErrorBoundary>
  );
};

export default SchedulePage;
