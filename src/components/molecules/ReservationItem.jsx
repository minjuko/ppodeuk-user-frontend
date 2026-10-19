import { useState } from "react";
import { Button } from "../atoms/Button";
import Image from "../atoms/Image";
import CustomModal from "../atoms/CustomModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelReservation } from "../../apis/reservations";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getErrorDetail } from "../../layouts/errorswitch";
import dayjs from "dayjs";
import { useToast } from "../feedback/ToastProvider";

const ReservationItem = ({
  rsvid,
  carwashid,
  imgsrc,
  reservedTime,
  bayname,
  priceinfo,
  buttontype,
  reviewed = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const start = dayjs(reservedTime.start);
  const end = dayjs(reservedTime.end);

  const handleBayClick = (rsvid, carwashid) => {
    dispatch({ type: "SET_CARWASH_ID", payload: carwashid });
    dispatch({ type: "SET_RESERVATION_ID", payload: rsvid });
    navigate(`/reviewpost`);
  };

  const mutation = useMutation({
    mutationFn: (rsvid) => cancelReservation(rsvid),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getHistory"] });
      setIsModalOpen(false);
      showToast({ message: "예약이 취소되었습니다." });
    },
    onError: (error) => {
      const errorDetail = error?.response
        ? getErrorDetail(error)
        : "예약 취소에 실패했습니다. 잠시 후 다시 시도해 주세요.";
      setIsModalOpen(false);
      showToast({
        message: errorDetail || "예약 취소에 실패했습니다. 다시 시도해 주세요.",
        tone: "error",
      });
    },
  });

  const handleConfirm = () => {
    mutation.mutate(rsvid);
  };

  const modalContent = (
    <div className="grid gap-2">
      <div>{bayname}</div>
      <div>예약일정:</div>
      <div>
        {start.format("YYYY-MM-DD HH:mm")} ~ {end.format("HH:mm")}
      </div>
      <div>취소 금액: {priceinfo}</div>
    </div>
  );

  return (
    <div className="p-4 bg-white border border-gray-300 shadow-sm rounded-lg">
      <div className="flex items-stretch gap-4">
        <Image
          src={imgsrc}
          className="block object-cover w-20 h-20 rounded-lg shrink-0"
          alt="세차장 이미지"
        />
        <div className="flex flex-col h-20 min-w-0 grow">
          <div className="text-xs leading-4 text-gray-500 whitespace-nowrap">
            {start.format("YYYY-MM-DD HH:mm")} ~ {end.format("HH:mm")}
          </div>
          <div className="mt-1 font-semibold leading-5 truncate">{bayname}</div>
          <div className="flex items-end justify-between gap-3 mt-auto">
            <div className="text-lg font-extrabold leading-none text-gray-900 whitespace-nowrap">
              {priceinfo.toLocaleString()}원
            </div>
            {buttontype === "cancel" && (
              <Button
                variant="cancel"
                disabled={mutation.isPending}
                onClick={() => setIsModalOpen(true)}
              >
                {mutation.isPending ? (
                  <span role="status" aria-live="polite">
                    취소 중...
                  </span>
                ) : (
                  "예약 취소"
                )}
              </Button>
            )}
            {buttontype === "review" && !reviewed && (
              <Button
                variant="review"
                onClick={() => handleBayClick(rsvid, carwashid)}
              >
                리뷰 작성
              </Button>
            )}
            {buttontype === "review" && reviewed && (
              <span className="inline-flex items-center h-9 px-3 text-xs font-bold text-gray-500 bg-gray-100 rounded-lg whitespace-nowrap">
                작성 완료
              </span>
            )}
          </div>
        </div>
      </div>
      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title="예약 취소 확인"
        content={modalContent}
        isPending={mutation.isPending}
        pendingText="예약 취소 중..."
        variant="danger"
        confirmText="취소하기"
        cancelText="닫기"
      />
    </div>
  );
};

export default ReservationItem;
