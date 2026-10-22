import { useEffect, useMemo, useState } from "react";
import OperatingHoursCard from "../atoms/OperatingHoursCard";
import TimePicker from "../molecules/TimePicker";
import DurationPicker from "../molecules/DurationPicker";
import DatePicker from "../molecules/DatePicker";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../atoms/Button";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { saveReservation, setBayId, setCarwashId } from "../../store/action";
import { carwashesInfo, carwashesBays } from "../../apis/carwashes";
import {
  buildReservationPayload,
  normalizeOpeningHours,
  parseLocalDateTime,
} from "../../utils/reservationTime";
import { getDemoDate } from "../../utils/demoDate";
import { useToast } from "../feedback/ToastProvider";

const ScheduleTemplate = ({ carwashId, bayId }) => {
  const location = useLocation();
  const [date, setDate] = useState(() => {
    const selectedDate = location.state?.selectedDate;
    return selectedDate ? new Date(selectedDate) : getDemoDate();
  });
  const [startTime, setStartTime] = useState();
  const [duration, setDuration] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

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

  const handleSubmit = () => {
    if (!startTime || !duration) {
      showToast({ message: "시작 시간과 사용 시간을 선택해 주세요." });
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

  const handleDateChange = (nextDate) => {
    setDate(nextDate);
    setStartTime(null);
    setDuration(null);
  };

  const handleDurationChange = (duration) => {
    setDuration(duration);
  };

  useEffect(() => {
    dispatch(setCarwashId(Number(carwashId)));
    dispatch(setBayId(Number(bayId)));
    setStartTime(null);
    setDuration(null);
  }, [carwashId, bayId, dispatch]);

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

  return (
    <div className="reservation-schedule-page">
      <div className="reservation-schedule-content mx-auto grid gap-4 md:max-w-4xl md:gap-6 md:pb-16">
        <h1 className="text-2xl font-extrabold text-gray-900">
          {name}: 베이 {bayInfo.bayNo}
        </h1>

        <OperatingHoursCard openingHours={openingHours} />

        <section className="reservation-schedule-card grid gap-2 p-4 bg-white border border-gray-300 rounded-lg">
          <h2 className="text-lg font-bold">예약 날짜</h2>
          <DatePicker
            className="reservation-schedule-date-picker"
            selectedDate={date}
            handleButtonClick={handleDateChange}
          />
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="reservation-schedule-card grid content-start self-start gap-2 p-4 bg-white border border-gray-300 rounded-lg">
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
          <section className="reservation-schedule-card grid content-start self-start gap-2 p-4 bg-white border border-gray-300 rounded-lg">
            <h2 className="text-lg font-bold">사용 시간</h2>
            <DurationPicker
              className="schedule-duration-options lg:grid-cols-3"
              bayId={bayInfo.bayId}
              handleButtonClick={handleDurationChange}
              selectedDate={date}
              startTime={startTime}
              bayBookedTimeList={bayInfo.bayBookedTimeList}
              openingHours={openingHours}
            />
          </section>
        </div>
        <section className="reservation-schedule-card reservation-schedule-summary grid gap-2 p-4 bg-sky-50 border border-sky-200 rounded-lg">
          <h2 className="text-lg font-semibold">예약 일정</h2>
          <div className="hidden sm:block">
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
          <div className="flex flex-wrap gap-x-2 text-xs sm:hidden">
            <span className="whitespace-nowrap">
              {date && `${date.getMonth() + 1}/${date.getDate()}`}{" "}
              {startTime || "시간 선택"}
            </span>
            <span className="whitespace-nowrap">
              → {computedEnd ? computedEnd.time : "종료 시간 선택"}
            </span>
          </div>
        </section>
      </div>
      <Button
        onClick={handleSubmit}
        variant="long"
        className="flow-primary-action fixed bottom-0"
      >
        예약하기
      </Button>
    </div>
  );
};

export default ScheduleTemplate;
