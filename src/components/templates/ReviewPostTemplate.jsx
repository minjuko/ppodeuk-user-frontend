import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { StarPicker } from "../atoms/StarPicker";
import { BadgeSet } from "../molecules/BadgeSet";
import { useNavigate } from "react-router-dom";
import { Button } from "../atoms/Button";
import { postReviews } from "../../apis/carwashes";
import { useSelector } from "react-redux";
import CustomModal from "../atoms/CustomModal";
import { getErrorDetail } from "../../layouts/errorswitch";
import Close from "/close.svg";

const REVIEW_KEYWORDS = [
  { id: 1, keyword: "사장님이 친절해요" },
  { id: 2, keyword: "간단한 용품을 팔아요" },
  { id: 3, keyword: "휴게공간이 있어요" },
  { id: 4, keyword: "가격이 합리적이에요" },
  { id: 5, keyword: "타이어 공기를 넣을 수 있어요" },
  { id: 6, keyword: "매장이 깨끗해요" },
  { id: 7, keyword: "여름엔 시원하고 겨울엔 따뜻해요" },
];

const ReviewPostTemplate = () => {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalContent, setModalContent] = useState("");
  const [isOverLimit, setIsOverLimit] = useState(false);

  const navigate = useNavigate();

  const carwashId = useSelector(
    (state) => state.reservationProcess.selectedCarwashId,
  );
  const reservationId = useSelector(
    (state) => state.reservationProcess.selectedReservationId,
  );

  const mutation = useMutation({
    mutationFn: (data) => {
      return postReviews(data);
    },
    onSuccess: () => {
      setModalContent("리뷰 등록에 성공했습니다.");
      setModalType("history");
      setIsModalOpen(true);
    },
    onError: (error) => {
      const errorDetail = getErrorDetail(error);
      setModalType("error");
      setModalContent(errorDetail);
      setIsModalOpen(true);
    },
  });

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    if (modalType === "history") {
      navigate("/history");
    }
    if (modalType === "error") {
      navigate("/");
    }
    setModalType(null);
  };

  const handleSubmit = () => {
    if (!carwashId || !reservationId) {
      setModalContent("예약 정보를 찾을 수 없습니다");
      setModalType("history");
      setIsModalOpen(true);
      return;
    }
    if (rate === 0 || comment.trim().length === 0) {
      setModalContent(
        rate === 0 ? "별점을 선택해주세요." : "후기를 입력해주세요.",
      );
      setModalType("info");
      setIsModalOpen(true);
      return;
    }
    if (comment.length > 100) {
      setIsOverLimit(true);
      return;
    }
    setIsOverLimit(false);
    const payload = {
      carwashId,
      reservationId,
      keywordIdList: selectedKeywords,
      rate,
      comment,
    };
    mutation.mutate(payload);
  };

  return (
    <div className="relative flex flex-col justify-center h-screen p-4">
      <Button
        className="absolute left-4 top-4"
        onClick={() => {
          navigate("/history");
        }}
      >
        <img src={Close} alt="닫기 버튼" />
      </Button>
      <div className="grid gap-8">
        <h1 className="mt-8 text-2xl font-bold text-center">
          예약한 세차장이 어땠나요?
        </h1>
        <StarPicker onRate={setRate} />
        <BadgeSet
          keywords={REVIEW_KEYWORDS}
          onSelectKeyword={setSelectedKeywords}
        />
        <textarea
          className={`p-4 pb-40 bg-gray-100 border border-gray-300 rounded-lg resize-none ${
            isOverLimit ? "border-red-500" : ""
          }`}
          placeholder="후기를 입력해주세요."
          value={comment}
          onChange={(e) => {
            if (e.target.value.length <= 100) {
              setComment(e.target.value);
              setIsOverLimit(false);
            } else {
              setIsOverLimit(true);
            }
          }}
        />
        {isOverLimit && (
          <div className="text-red-500">100자 이내로만 작성 가능합니다.</div>
        )}
        <Button
          variant="long"
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="fixed bottom-0 left-0"
        >
          {mutation.isPending ? "등록 중..." : "리뷰 등록하기"}
        </Button>
        <CustomModal
          isOpen={isModalOpen}
          onConfirm={handleModalConfirm}
          title="알림"
          content={modalContent}
          confirmText="확인"
        />
      </div>
    </div>
  );
};

export default ReviewPostTemplate;
