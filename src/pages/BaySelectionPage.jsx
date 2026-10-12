import { Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BaySelectionTemplate from "../components/templates/BaySelectionTemplate";
import { GeneralErrorBoundary } from "../components/atoms/GeneralErrorBoundary";
import SectionSkeleton from "../components/feedback/SectionSkeleton";

const BaySelectionPage = () => {
  const { carwashId } = useParams();
  const navigate = useNavigate();
  return (
    <GeneralErrorBoundary navigate={navigate}>
      <Suspense
        fallback={
          <SectionSkeleton rows={4} label="베이 정보를 불러오는 중입니다." />
        }
      >
        <BaySelectionTemplate carwashId={carwashId} />
      </Suspense>
    </GeneralErrorBoundary>
  );
};

export default BaySelectionPage;
