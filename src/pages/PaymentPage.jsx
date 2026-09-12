import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import PaymentTemplate from "../components/templates/PaymentTemplate";
import { GeneralErrorBoundary } from "../components/atoms/GeneralErrorBoundary";
import Loader from "../components/atoms/Loader";

const PaymentPage = () => {
  const navigate = useNavigate();
  return (
    <GeneralErrorBoundary navigate={navigate}>
      <Suspense fallback={<Loader />}>
        <PaymentTemplate />
      </Suspense>
    </GeneralErrorBoundary>
  );
};

export default PaymentPage;
