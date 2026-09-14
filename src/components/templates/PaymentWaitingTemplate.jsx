import { Button } from "../atoms/Button";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { pgapprove } from "../../apis/payment";
import CustomModal from "../atoms/CustomModal";
import { getErrorDetail } from "../../layouts/errorswitch";
import { clearPayment, resetStore } from "../../store/action";
import { useDispatch } from "react-redux";

const PaymentWaitingTemplate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [failmodalContent, setFailmodalContent] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pgToken = queryParams.get("pg_token");

  const bayId = useSelector((state) => state.reservationProcess.selectedBayId);
  const carwashId = useSelector(
    (state) => state.reservationProcess.selectedCarwashId,
  );
  const reservations = useSelector(
    (state) => state.reservationProcess.reservations,
  );
  const tid = useSelector((state) => state.reservationProcess.tid);
  const hasCallbackState = Boolean(
    pgToken &&
      tid &&
      carwashId &&
      bayId &&
      reservations?.startTime &&
      reservations?.endTime,
  );

  useEffect(() => {
    if (!hasCallbackState) dispatch(clearPayment());
  }, [dispatch, hasCallbackState]);

  const { mutate: approveMutate, isPending: isApproving } = useMutation({
    mutationFn: (data) => pgapprove(data),
    onSuccess: (data) => {
      dispatch(resetStore());
      navigate("/paymentresult", { state: { reservationData: data.data } });
    },
    onError: (error) => {
      dispatch(clearPayment());
      const errorDetail = getErrorDetail(error);
      setFailmodalContent(errorDetail);
      setIsModalOpen(true);
    },
  });
  const handleConfirm = () => {
    setIsModalOpen(false);
    navigate("/payment");
  };

  const modalContent = (
    <div className="flex flex-col gap-2">
      <div> 오류가 발생하였습니다.</div>
      <div>{failmodalContent}</div>
    </div>
  );

  const handlePayment = () => {
    if (!hasCallbackState) return;
    const approvepostData = {
      payApprovalRequestDTO: {
        cid: "TC0ONETIME",
        tid: tid,
        partner_order_id: "partner_order_id",
        partner_user_id: "partner_user_id",
        pg_token: pgToken,
      },
      saveDTO: {
        bayId: bayId,
        startTime: reservations.startTime,
        endTime: reservations.endTime,
      },
    };

    approveMutate(approvepostData);
  };

  if (!hasCallbackState) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
        <h1 className="text-2xl font-bold">
          결제 승인 정보를 확인할 수 없습니다.
        </h1>
        <p className="mt-4 text-gray-600">
          결제를 다시 시작하거나 예약 정보를 확인해 주세요.
        </p>
        <Button
          variant="long"
          className="fixed bottom-0 left-0"
          onClick={() => {
            dispatch(clearPayment());
            navigate("/payment");
          }}
        >
          결제 화면으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="mx-4 text-3xl font-semibold">결제 진행 중</h1>
      <Button
        variant="long"
        className="fixed bottom-0 left-0"
        onClick={handlePayment}
        disabled={isApproving}
      >
        {isApproving ? (
          <span role="status" aria-live="polite">
            결제 승인 중...
          </span>
        ) : (
          "결제 완료를 위해 클릭하세요"
        )}
      </Button>
      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title="오류발생"
        content={modalContent}
        confirmText="홈으로"
      />
    </div>
  );
};
export default PaymentWaitingTemplate;
