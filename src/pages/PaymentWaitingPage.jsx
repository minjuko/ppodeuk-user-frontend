import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { GeneralErrorBoundary } from "../components/atoms/GeneralErrorBoundary.jsx";
import Loader from "../components/atoms/Loader";

import PaymentWaitingTemplate from "../components/templates/PaymentWaitingTemplate.jsx";
const PaymentWaitingPage = () => {
  const navigate = useNavigate();
  return (
    <GeneralErrorBoundary navigate={navigate}>
      <Suspense fallback={<Loader />}>
        <PaymentWaitingTemplate />
      </Suspense>
    </GeneralErrorBoundary>
  );
};

export default PaymentWaitingPage;
