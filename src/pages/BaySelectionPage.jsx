import { Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BaySelectionTemplate from "../components/templates/BaySelectionTemplate";
import { GeneralErrorBoundary } from "../components/atoms/GeneralErrorBoundary";
import SectionSkeleton from "../components/feedback/SectionSkeleton";
import { Button } from "../components/atoms/Button";
import { parseReservationRouteId } from "../utils/reservationRoute";

const BaySelectionPage = () => {
  const { carwashId } = useParams();
  const navigate = useNavigate();
  const parsedCarwashId = parseReservationRouteId(carwashId);
  if (parsedCarwashId === null) {
    return (
      <main className="grid min-h-screen place-content-center gap-4 p-6 text-center">
        <p role="alert">유효하지 않은 세차장 정보입니다.</p>
        <Button onClick={() => navigate("/reservation")}>예약 다시 시작</Button>
      </main>
    );
  }
  return (
    <GeneralErrorBoundary navigate={navigate}>
      <Suspense
        fallback={
          <SectionSkeleton rows={4} label="베이 정보를 불러오는 중입니다." />
        }
      >
        <BaySelectionTemplate carwashId={parsedCarwashId} />
      </Suspense>
    </GeneralErrorBoundary>
  );
};

export default BaySelectionPage;
