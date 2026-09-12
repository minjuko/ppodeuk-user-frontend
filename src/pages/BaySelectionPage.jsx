import { Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BaySelectionTemplate from "../components/templates/BaySelectionTemplate";
import { GeneralErrorBoundary } from "../components/atoms/GeneralErrorBoundary";
import Loader from "../components/atoms/Loader";

const BaySelectionPage = () => {
  const { carwashId } = useParams();
  const navigate = useNavigate();
  return (
    <GeneralErrorBoundary navigate={navigate}>
      <Suspense fallback={<Loader />}>
        <BaySelectionTemplate carwashId={carwashId} />
      </Suspense>
    </GeneralErrorBoundary>
  );
};

export default BaySelectionPage;
