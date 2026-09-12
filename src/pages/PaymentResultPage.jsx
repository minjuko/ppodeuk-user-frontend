import { Suspense } from "react";
import PaymentResultTemplate from "../components/templates/PaymentResultTemplate.jsx";
import { GeneralErrorBoundary } from "../components/atoms/GeneralErrorBoundary.jsx";
import { useNavigate } from "react-router-dom";
import Loader from "../components/atoms/Loader";

const PaymentResultPage = () => {
  const navigate = useNavigate();
  return (
    <GeneralErrorBoundary navigate={navigate}>
      <Suspense fallback={<Loader />}>
        <PaymentResultTemplate />
      </Suspense>
    </GeneralErrorBoundary>
  );
};

export default PaymentResultPage;
