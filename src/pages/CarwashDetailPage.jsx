import { Suspense } from "react";
import { useParams } from "react-router-dom";
import CarwashDetailTemplate from "../components/templates/CarwashDetailTemplate";
import { useNavigate } from "react-router-dom";
import { GeneralErrorBoundary } from "../components/atoms/GeneralErrorBoundary";
import SectionSkeleton from "../components/feedback/SectionSkeleton";
import { Button } from "../components/atoms/Button";
import { parseReservationRouteId } from "../utils/reservationRoute";

const CarwashDetailPage = () => {
  const navigate = useNavigate();
  const { carwashId } = useParams();
  const parsedCarwashId = parseReservationRouteId(carwashId);
  if (parsedCarwashId === null) {
    return (
      <main className="grid min-h-screen place-content-center gap-4 p-6 text-center">
        <p role="alert">?좏슚?섏? ?딆? ?몄감???뺣낫?낅땲??</p>
        <Button onClick={() => navigate("/reservation")}>
          ?덉빟 ?ㅼ떆 ?쒖옉
        </Button>
      </main>
    );
  }
  return (
    <GeneralErrorBoundary navigate={navigate}>
      <Suspense
        fallback={
          <SectionSkeleton rows={5} label="세차장 정보를 불러오는 중입니다." />
        }
      >
        <CarwashDetailTemplate carwashId={parsedCarwashId} />
      </Suspense>
    </GeneralErrorBoundary>
  );
};

export default CarwashDetailPage;
