import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { GeneralErrorBoundary } from "../components/atoms/GeneralErrorBoundary.jsx";
import SectionSkeleton from "../components/feedback/SectionSkeleton";

import PaymentWaitingTemplate from "../components/templates/PaymentWaitingTemplate.jsx";
const PaymentWaitingPage = () => {
  const navigate = useNavigate();
  return (
    <GeneralErrorBoundary navigate={navigate}>
      <Suspense
        fallback={
          <SectionSkeleton rows={3} label="결제 상태를 확인하는 중입니다." />
        }
      >
        <PaymentWaitingTemplate />
      </Suspense>
    </GeneralErrorBoundary>
  );
};

export default PaymentWaitingPage;
