import { useEffect } from "react";
import { Button } from "../components/atoms/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearPayment } from "../store/action";

const PaymentFailPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearPayment());
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <div className="mb-8 text-3xl font-semibold">결제 실패</div>
      <div className="">결제 실패입니다. 잠시 후 다시 시도해주세요.</div>
      <Button
        variant="long"
        className="fixed bottom-0 left-0"
        onClick={() => navigate("/")}
      >
        홈으로 돌아가기
      </Button>
    </div>
  );
};

export default PaymentFailPage;
