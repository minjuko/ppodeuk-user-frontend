import { Suspense } from "react";
import { useParams } from "react-router-dom";
import CarwashDetailTemplate from "../components/templates/CarwashDetailTemplate";
import { useNavigate } from "react-router-dom";
import { GeneralErrorBoundary } from "../components/atoms/GeneralErrorBoundary";
import SectionSkeleton from "../components/feedback/SectionSkeleton";

const CarwashDetailPage = () => {
  const navigate = useNavigate();
  const { carwashId } = useParams();
  return (
    <GeneralErrorBoundary navigate={navigate}>
      <Suspense
        fallback={
          <SectionSkeleton rows={5} label="세차장 정보를 불러오는 중입니다." />
        }
      >
        <CarwashDetailTemplate carwashId={carwashId} />
      </Suspense>
    </GeneralErrorBoundary>
  );
};

export default CarwashDetailPage;
