import { useState, useEffect } from "react";
import {
  generateTimeSlots,
  getOpeningPeriodForDate,
  isPastSlot,
  isReservationOverlapping,
} from "../../utils/reservationTime";
import { getDemoDate } from "../../utils/demoDate";

const isToday = (date, now = new Date()) =>
  date.getFullYear() === now.getFullYear() &&
  date.getMonth() === now.getMonth() &&
  date.getDate() === now.getDate();

const shouldShowMorning = (date, now = new Date()) =>
  !isToday(date, now) || now.getHours() < 12;

const TimePicker = ({
  openingHours,
  handleButtonClick,
  bayBookedTimeList,
  selectedDate,
}) => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [isMorningSelected, setIsMorningSelected] = useState(() =>
    shouldShowMorning(selectedDate, getDemoDate()),
  );

  useEffect(() => {
    setSelectedTime(null);
    setIsMorningSelected(shouldShowMorning(selectedDate, getDemoDate()));
  }, [selectedDate]);

  const isScheduled = (time) => {
    return isReservationOverlapping(selectedDate, time, 30, bayBookedTimeList);
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
    handleButtonClick(time);
  };

  const currentOpeningHours = getOpeningPeriodForDate(
    openingHours,
    selectedDate,
  );
  const allHours = generateTimeSlots(currentOpeningHours);
  const currentHours = allHours.filter((time) =>
    isMorningSelected ? time < "12:00" : time >= "12:00",
  );

  return (
    <div className="grid gap-2">
      <div className="flex p-1 bg-gray-100 border border-gray-200 rounded-lg">
        <button
          onClick={() => setIsMorningSelected(true)}
          type="button"
          className={`w-1/2 py-2 font-semibold rounded-md transition ${
            isMorningSelected
              ? "bg-white text-primary shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          } `}
        >
          오전
        </button>
        <button
          onClick={() => setIsMorningSelected(false)}
          type="button"
          className={`w-1/2 py-2 font-semibold rounded-md transition ${
            !isMorningSelected
              ? "bg-white text-primary shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          } `}
        >
          오후
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="schedule-time-slots grid w-full gap-1.5 sm:gap-2">
          {currentHours.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => handleTimeClick(time)}
              disabled={
                isScheduled(time) ||
                isPastSlot(selectedDate, time, getDemoDate())
              }
              aria-pressed={selectedTime === time}
              className={`min-h-11 px-1 py-2 text-sm font-medium border border-gray-300 rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-2 sm:py-3 ${
                selectedTime === time
                  ? "border-primary bg-primary text-white hover:brightness-95"
                  : "bg-white text-gray-600 hover:border-primary hover:bg-sky-50 hover:text-gray-900"
              } ${
                (isScheduled(time) ||
                  isPastSlot(selectedDate, time, getDemoDate())) &&
                "opacity-50 cursor-not-allowed"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimePicker;
