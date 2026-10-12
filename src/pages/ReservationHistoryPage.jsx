import { Suspense } from "react";
import ReservationHistoryTemplate from "../components/templates/ReservationHistoryTemplate.jsx";
import { GeneralErrorBoundary } from "../components/atoms/GeneralErrorBoundary.jsx";
import { useNavigate } from "react-router-dom";
import SectionSkeleton from "../components/feedback/SectionSkeleton";

const ReservationHistoryPage = () => {
  const navigate = useNavigate();
  return (
    <GeneralErrorBoundary navigate={navigate}>
      <Suspense
        fallback={
          <SectionSkeleton rows={5} label="예약 내역을 불러오는 중입니다." />
        }
      >
        <ReservationHistoryTemplate />
      </Suspense>
    </GeneralErrorBoundary>
  );
};

export default ReservationHistoryPage;
