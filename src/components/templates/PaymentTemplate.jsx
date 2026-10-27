import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { calculatePayment } from "../../apis/carwashes";
import { pgpayment } from "../../apis/payment";
import dayjs from "dayjs";
import { Button } from "../atoms/Button";
import CustomModal from "../atoms/CustomModal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { isMobile } from "react-device-detect";
import KakaoPayIcon from "/kakaopay.png";
import { getErrorDetail } from "../../layouts/errorswitch";
import { clearPayment, saveTid } from "../../store/action";
import {
  selectReservationBayId,
  selectReservationCarwashId,
  selectReservationRange,
} from "../../store/reservationSelectors";
import {
  isPaymentCalculationResponse,
  isPaymentReadyResponse,
  resolvePaymentRedirectUrl,
} from "../../apis/paymentTypes";

const PaymentTemplate = () => {
  const [paymentData, setPaymentData] = useState({ price: undefined });
  const [redirectLink, setRedirectLink] = useState(null);
  const [failmodalContent, setFailmodalContent] = useState("");
  const reservations = useSelector(selectReservationRange);
  const carwashId = useSelector(selectReservationCarwashId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const bayId = useSelector(selectReservationBayId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasReservation = Boolean(
    carwashId && bayId && reservations?.startTime && reservations?.endTime,
  );

  const { mutate: paymentCalMutate, isPending: isCalculatingPrice } =
    useMutation({
      mutationFn: (data) => calculatePayment(bayId, data),
      onSuccess: (data) => {
        if (!isPaymentCalculationResponse(data?.data?.response)) {
          setPaymentData({ price: undefined });
          setFailmodalContent(getErrorDetail(new Error()));
          setIsModalOpen(true);
          return;
        }
        setPaymentData({ price: data.data.response.price });
      },
      onError: (error) => {
        const errorDetail = getErrorDetail(error);
        setFailmodalContent(errorDetail);
        setIsModalOpen(true);
      },
    });

  const { mutate: payMutate, isPending: isPreparingPayment } = useMutation({
    mutationFn: (data) => pgpayment(data),
    onSuccess: (data) => {
      const candidate = data?.data?.response;
      if (!isPaymentReadyResponse(candidate)) {
        dispatch(clearPayment());
        setFailmodalContent(getErrorDetail(new Error()));
        setIsModalOpen(true);
        return;
      }
      const response = candidate;
      const nextRedirectUrl = isMobile
        ? response?.next_redirect_mobile_url
        : response?.next_redirect_pc_url;
      const redirectUrl = resolvePaymentRedirectUrl(
        nextRedirectUrl,
        window.location.origin,
      );

      if (!response?.tid || !redirectUrl) {
        dispatch(clearPayment());
        setFailmodalContent("결제 준비 응답이 올바르지 않습니다.");
        setIsModalOpen(true);
        return;
      }

      dispatch(saveTid(response.tid));

      // KakaoPay의 next_redirect_*_url은 외부 결제 브릿지 URL입니다.
      // origin을 현재 프론트로 바꾸면 KakaoPay 인증 화면에 진입할 수 없습니다.
      setRedirectLink(redirectUrl.href);
    },
    onError: (error) => {
      dispatch(clearPayment());
      setFailmodalContent(getErrorDetail(error));
      setIsModalOpen(true);
    },
  });
  useEffect(() => {
    if (redirectLink) {
      const redirectUrl = resolvePaymentRedirectUrl(
        redirectLink,
        window.location.origin,
      );
      if (!redirectUrl) {
        dispatch(clearPayment());
        setFailmodalContent(getErrorDetail(new Error()));
        setIsModalOpen(true);
        return;
      }

      if (redirectUrl.origin === window.location.origin) {
        navigate(
          `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`,
        );
        return;
      }

      window.location.href = redirectUrl.href;
    }
  }, [dispatch, navigate, redirectLink]);

  const handleConfirm = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  const handlePayment = () => {
    if (!hasReservation) {
      setIsModalOpen(true);
      return;
    }
    const paypostData = {
      requestDto: {
        cid: "TC0ONETIME",
        partner_order_id: "partner_order_id",
        partner_user_id: "partner_user_id",
        item_name: "결제하기",
        quantity: 1,
        total_amount: paymentData?.price,
        tax_free_amount: 0,
      },
      saveDTO: {
        bayId: bayId,
        startTime: reservations.startTime,
        endTime: reservations.endTime,
      },
    };
    dispatch(clearPayment());
    payMutate(paypostData);
  };

  useEffect(() => {
    if (hasReservation) {
      paymentCalMutate(reservations);
    }
  }, [hasReservation, reservations, paymentCalMutate]);

  if (!hasReservation) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
        <h1 className="text-2xl font-bold">결제할 예약 정보가 없습니다.</h1>
        <Button
          variant="long"
          className="flow-primary-action fixed bottom-0 left-0"
          onClick={() => navigate("/reservation")}
        >
          예약 다시 시작
        </Button>
      </div>
    );
  }

  const formatDateStart = (dateString) => {
    const datePart = dayjs(dateString).format("YYYY년 MM월 DD일");
    const timePart = dayjs(dateString).format("HH시 mm분");
    return { datePart, timePart };
  };

  const formatDateEnd = (dateString) => {
    return dayjs(dateString).format("HH시 mm분");
  };

  const calculateDuration = (start, end) => {
    const duration = dayjs(end).diff(dayjs(start), "minute");
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}시간` + (minutes > 0 ? ` ${minutes}분` : "");
  };

  const { datePart, timePart } = formatDateStart(reservations.startTime);
  const endTimeFormatted = formatDateEnd(reservations.endTime);

  const duration = calculateDuration(
    reservations.startTime,
    reservations.endTime,
  );
  const paymentAmount = paymentData?.price ?? "계산 중...";
  const canPay = isPaymentCalculationResponse(paymentData);

  const modalContent = (
    <div className="flex flex-col gap-2">
      <div>누락된 데이터가 있습니다. 예약을 처음부터 시도해 주세요.</div>
    </div>
  );
  return (
    <div>
      <div className="mx-auto grid gap-6 md:max-w-2xl md:gap-8 md:pt-8">
        <h1 className="text-2xl font-bold">결제하기</h1>
        <div className="p-4 bg-gray-100 rounded-xl grid-4">
          <div>
            <div className="text-lg font-semibold">예약 일정</div>
            <div className="text-right">
              <div>{datePart}</div>
              <div>
                {timePart} - {endTimeFormatted} ({duration})
              </div>
            </div>
          </div>
          <div className="flex justify-between text-lg font-semibold text-red-700">
            <div>최종 결제 금액</div>
            <div>{paymentAmount.toLocaleString()}원</div>
          </div>
        </div>
      </div>
      <Button
        className="flow-primary-action fixed bottom-0 left-0 w-full p-4 text-center bg-kakao"
        onClick={handlePayment}
        disabled={isCalculatingPrice || isPreparingPayment || !canPay}
      >
        <div className="flex items-center justify-center gap-2 text-xl font-semibold">
          <img src={KakaoPayIcon} alt="카카오페이 아이콘" className="w-14" />
          <div>
            {isPreparingPayment ? (
              <span role="status" aria-live="polite">
                결제 준비 중...
              </span>
            ) : (
              "결제하기"
            )}
          </div>
        </div>
      </Button>
      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title="누락 오류"
        content={failmodalContent ? failmodalContent : modalContent}
        confirmText="확인"
      />
    </div>
  );
};

export default PaymentTemplate;
