import ReviewPostTemplate from "../components/templates/ReviewPostTemplate";
import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { GeneralErrorBoundary } from "../components/atoms/GeneralErrorBoundary";
import SectionSkeleton from "../components/feedback/SectionSkeleton";

const ReviewPostPage = () => {
  const navigate = useNavigate();
  return (
    <GeneralErrorBoundary navigate={navigate}>
      <Suspense
        fallback={
          <SectionSkeleton rows={4} label="리뷰 정보를 불러오는 중입니다." />
        }
      >
        <ReviewPostTemplate />
      </Suspense>
    </GeneralErrorBoundary>
  );
};

export default ReviewPostPage;
