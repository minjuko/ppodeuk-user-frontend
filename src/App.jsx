import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import Modal from "react-modal";
import AuthLayout from "./layouts/AuthLayout";
import AuthLayoutWithStatusBar from "./layouts/AuthLayoutWithStatusBar";
import Loader from "./components/atoms/Loader";
import DemoNotice from "./components/atoms/DemoNotice";

const HomePage = lazy(() =>
  import("./pages/HomePage").then((module) => ({ default: module.HomePage })),
);
const ReservationPage = lazy(() => import("./pages/ReservationPage"));
const CarwashDetailPage = lazy(() => import("./pages/CarwashDetailPage"));
const BaySelectionPage = lazy(() => import("./pages/BaySelectionPage"));
const SchedulePage = lazy(() => import("./pages/SchedulePage"));
const ReservationHistoryPage = lazy(() =>
  import("./pages/ReservationHistoryPage"),
);
const PaymentResultPage = lazy(() => import("./pages/PaymentResultPage"));
const ReviewPostPage = lazy(() => import("./pages/ReviewPostPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const PaymentWaitingPage = lazy(() => import("./pages/PaymentWaitingPage"));
const PaymentFailPage = lazy(() => import("./pages/PaymentFailPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));

Modal.setAppElement("#root");
function App() {
  return (
    <BrowserRouter>
      {__DEMO_BUILD__ && <DemoNotice />}
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="reservation" element={<ReservationPage />} />
            <Route element={<AuthLayout />}>
              <Route path="history" element={<ReservationHistoryPage />} />
            </Route>
          </Route>

          <Route
            path="carwashdetail/:carwashId"
            element={<CarwashDetailPage />}
          />

          <Route element={<AuthLayoutWithStatusBar />}>
            <Route
              path="bayselection/:carwashId"
              element={<BaySelectionPage />}
            />
            <Route
              path="schedule/:carwashId/:bayId"
              element={<SchedulePage />}
            />
            <Route path="payment" element={<PaymentPage />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="paymentwaiting" element={<PaymentWaitingPage />} />
            <Route path="paymentfail" element={<PaymentFailPage />} />
            <Route path="paymentresult" element={<PaymentResultPage />} />
            <Route path="reviewpost" element={<ReviewPostPage />} />
            <Route path="unauthorized" element={<ErrorPage />} />
          </Route>

          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
export default App;
