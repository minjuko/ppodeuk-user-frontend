import { Suspense } from "react";
import { GeneralErrorBoundary } from "../components/atoms/GeneralErrorBoundary";
import { useNavigate } from "react-router-dom";
import SectionSkeleton from "../components/feedback/SectionSkeleton";

import ReservationTemplate from "../components/templates/ReservationTemplate";
const ReservationPage = () => {
  const navigate = useNavigate();
  return (
    <GeneralErrorBoundary navigate={navigate}>
      <Suspense
        fallback={
          <SectionSkeleton rows={4} label="예약 정보를 불러오는 중입니다." />
        }
      >
        <ReservationTemplate />
      </Suspense>
    </GeneralErrorBoundary>
  );
};
export default ReservationPage;
