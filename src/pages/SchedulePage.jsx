import { Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScheduleTemplate from "../components/templates/ScheduleTemplate";
import { GeneralErrorBoundary } from "../components/atoms/GeneralErrorBoundary";
import SectionSkeleton from "../components/feedback/SectionSkeleton";

const SchedulePage = () => {
  const navigate = useNavigate();
  const { carwashId, bayId } = useParams();

  return (
    <GeneralErrorBoundary navigate={navigate}>
      <Suspense
        fallback={
          <SectionSkeleton rows={5} label="예약 일정을 불러오는 중입니다." />
        }
      >
        <ScheduleTemplate carwashId={carwashId} bayId={bayId} />
      </Suspense>
    </GeneralErrorBoundary>
  );
};

export default SchedulePage;
