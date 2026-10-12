import { Suspense } from "react";
import HomeTemplate from "../components/templates/HomeTemplate";
import { GeneralErrorBoundary } from "../components/atoms/GeneralErrorBoundary";
import { useNavigate } from "react-router-dom";
import SectionSkeleton from "../components/feedback/SectionSkeleton";

export const HomePage = () => {
  const navigate = useNavigate();
  return (
    <GeneralErrorBoundary navigate={navigate}>
      <Suspense
        fallback={
          <SectionSkeleton rows={4} label="홈 정보를 불러오는 중입니다." />
        }
      >
        <HomeTemplate />
      </Suspense>
    </GeneralErrorBoundary>
  );
};
