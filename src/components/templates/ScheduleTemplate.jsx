import { useEffect, useMemo, useState } from "react";
import TimeImage from "/StoreInfo/Time.svg";
import Image from "../atoms/Image";
import CustomModal from "../atoms/CustomModal";
import TimePicker from "../molecules/TimePicker";
import DurationPicker from "../molecules/DurationPicker";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../atoms/Button";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { saveReservation } from "../../store/action";
import { carwashesInfo, carwashesBays } from "../../apis/carwashes";
import {
  buildReservationPayload,
  normalizeOpeningHours,
  parseLocalDateTime,
} from "../../utils/reservationTime";

const ScheduleTemplate = ({ carwashId, bayId }) => {
  const location = useLocation();
  const [date] = useState(() => {
    const selectedDate = location.state?.selectedDate;
    return selectedDate ? new Date(selectedDate) : new Date();
  });
  const [startTime, setStartTime] = useState();
  const [duration, setDuration] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [washinfo, bayinfo] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["washinfo", carwashId],
        queryFn: () => carwashesInfo(carwashId),
      },
      {
        queryKey: ["bayinfo", carwashId],
        queryFn: () => carwashesBays(carwashId),
      },
    ],
  });

  const handleConfirm = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    if (!startTime || !duration) {
      setIsModalOpen(true);
      return;
    }

    dispatch(
      saveReservation(reservationPayload.startTime, reservationPayload.endTime),
    );
    navigate("/payment");
  };

  const name = washinfo?.data?.data?.response?.name;
  const openingHours = useMemo(
    () => normalizeOpeningHours(washinfo?.data?.data?.response?.optime),
    [washinfo?.data?.data?.response?.optime],
  );

  const bayInfo = bayinfo?.data?.data?.response.bayList.find(
    (bay) => bay.bayId === parseInt(bayId),
  );

  const handleStartTimeChange = (time) => {
    setStartTime(time);
    setDuration(null);
  };

  const handleDurationChange = (duration) => {
    setDuration(duration);
  };

  useEffect(() => {
    setStartTime(null);
    setDuration(null);
  }, [carwashId, bayId]);

  const reservationPayload =
    startTime && duration
      ? buildReservationPayload(bayInfo.bayId, date, startTime, duration)
      : null;
  const computedEnd = reservationPayload
    ? {
        date: parseLocalDateTime(reservationPayload.endTime),
        time: reservationPayload.endTime.slice(11),
      }
    : null;

  const modalContent = (
    <div className="flex flex-col gap-2">
      <div>시작시간과 사용시간을 모두 선택해주세요</div>
    </div>
  );

  return (
    <div>
      <div className="p-4 grid-4">
        <h1 className="text-2xl font-bold">
          {name}: 베이 {bayInfo.bayNo}
        </h1>

        <section className="flex items-center gap-2">
          <Image src={TimeImage} alt="영업시간" />
          <div>
            <div>
              평일 {openingHours.weekday.start} ~ {openingHours.weekday.end}
            </div>
            <div>
              주말 {openingHours.weekend.start} ~ {openingHours.weekend.end}
            </div>
          </div>
        </section>

        <div className="grid gap-6">
          <section className="grid gap-2">
            <h2 className="text-lg font-bold">시작 시간</h2>
            <TimePicker
              bayId={bayInfo.bayId}
              openingHours={openingHours}
              handleButtonClick={handleStartTimeChange}
              bayBookedTimeList={bayInfo.bayBookedTimeList}
              duration={duration}
              selectedDate={date}
            />
          </section>
          <section className="grid gap-2">
            <h2 className="text-lg font-bold">사용 시간</h2>
            <DurationPicker
              bayId={bayInfo.bayId}
              handleButtonClick={handleDurationChange}
              selectedDate={date}
              startTime={startTime}
              bayBookedTimeList={bayInfo.bayBookedTimeList}
              openingHours={openingHours}
            />
          </section>
        </div>
        <section className="grid gap-2 p-4 bg-gray-100 border rounded-lg">
          <h2 className="text-lg font-semibold">예약 일정</h2>
          <div>
            <div>
              시작 시간:&nbsp;
              {date &&
                `${date.getFullYear()}년 ${
                  date.getMonth() + 1
                }월 ${date.getDate()}일 ${startTime || ""} `}
            </div>
            <div>
              종료 시간:&nbsp;
              {computedEnd &&
                `${computedEnd.date.getFullYear()}년 ${
                  computedEnd.date.getMonth() + 1
                }월 ${computedEnd.date.getDate()}일 ${computedEnd.time}`}
            </div>
          </div>
        </section>
      </div>
      <Button onClick={handleSubmit} variant="long" className="fixed bottom-0">
        예약하기
      </Button>
      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title="알림"
        content={modalContent}
        confirmText="확인"
      />
    </div>
  );
};

export default ScheduleTemplate;
