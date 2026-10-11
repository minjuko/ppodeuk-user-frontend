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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [failmodalContent, setFailmodalContent] = useState("");

  const start = dayjs(reservedTime.start);
  const end = dayjs(reservedTime.end);

  const handleBayClick = (rsvid, carwashid) => {
    dispatch({ type: "SET_CARWASH_ID", payload: carwashid });
    dispatch({ type: "SET_RESERVATION_ID", payload: rsvid });
    navigate(`/reviewpost`);
  };

  const mutation = useMutation({
    mutationFn: (rsvid) => cancelReservation(rsvid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getHistory"] });
    },
    onError: (error) => {
      const errorDetail = getErrorDetail(error);
      setFailmodalContent(errorDetail);
      setIsModalOpen(true);
    },
  });

  const handleConfirm = () => {
    if (!failmodalContent) mutation.mutate(rsvid);
    setIsModalOpen(false);
    if (failmodalContent) navigate("/");
  };

  const modalContent = failmodalContent ? (
    <div className="grid gap-2">
      <div>오류가 발생하였습니다.</div>
      <div>{failmodalContent}</div>
    </div>
  ) : (
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
      <div className="flex items-center gap-4">
        <Image
          src={imgsrc}
          className="object-cover w-16 h-16 rounded-lg shrink-0"
          alt="세차장 이미지"
        />
        <div className="min-w-0 grow">
          <div className="text-xs text-gray-500">
            {start.format("YYYY-MM-DD HH:mm")} ~ {end.format("HH:mm")}
          </div>
          <div className="mt-1 font-semibold truncate">{bayname}</div>
          <div className="flex items-end justify-between gap-3 mt-2">
            <div className="text-lg font-extrabold leading-none text-gray-900">
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
              <span className="px-3 py-2 text-xs font-bold text-gray-500 bg-gray-100 rounded-lg">
                작성 완료
              </span>
            )}{" "}
          </div>
        </div>
      </div>
      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title={failmodalContent ? "오류발생" : "예약 취소 확인"}
        content={modalContent}
        confirmText={failmodalContent ? "홈으로" : "취소하기"}
        cancelText={failmodalContent ? null : "닫기"}
      />
    </div>
  );
};

export default ReservationItem;
