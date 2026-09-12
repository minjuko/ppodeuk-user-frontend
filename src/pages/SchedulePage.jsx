import { Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScheduleTemplate from "../components/templates/ScheduleTemplate";
import { GeneralErrorBoundary } from "../components/atoms/GeneralErrorBoundary";
import Loader from "../components/atoms/Loader";

const SchedulePage = () => {
  const navigate = useNavigate();
  const { carwashId, bayId } = useParams();

  return (
    <GeneralErrorBoundary navigate={navigate}>
      <Suspense fallback={<Loader />}>
        <ScheduleTemplate carwashId={carwashId} bayId={bayId} />
      </Suspense>
    </GeneralErrorBoundary>
  );
};

export default SchedulePage;
