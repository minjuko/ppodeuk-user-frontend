import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import PaymentTemplate from "../components/templates/PaymentTemplate";
import { GeneralErrorBoundary } from "../components/atoms/GeneralErrorBoundary";
import SectionSkeleton from "../components/feedback/SectionSkeleton";

const PaymentPage = () => {
  const navigate = useNavigate();
  return (
    <GeneralErrorBoundary navigate={navigate}>
      <Suspense
        fallback={
          <SectionSkeleton rows={3} label="결제 정보를 불러오는 중입니다." />
        }
      >
        <PaymentTemplate />
      </Suspense>
    </GeneralErrorBoundary>
  );
};

export default PaymentPage;
