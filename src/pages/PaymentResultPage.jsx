import { Suspense } from "react";
import PaymentResultTemplate from "../components/templates/PaymentResultTemplate.jsx";
import { GeneralErrorBoundary } from "../components/atoms/GeneralErrorBoundary.jsx";
import { useNavigate } from "react-router-dom";
import SectionSkeleton from "../components/feedback/SectionSkeleton";

const PaymentResultPage = () => {
  const navigate = useNavigate();
  return (
    <GeneralErrorBoundary navigate={navigate}>
      <Suspense
        fallback={
          <SectionSkeleton rows={3} label="결제 결과를 확인하는 중입니다." />
        }
      >
        <PaymentResultTemplate />
      </Suspense>
    </GeneralErrorBoundary>
  );
};

export default PaymentResultPage;
