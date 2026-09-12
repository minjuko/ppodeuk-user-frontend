import { useState, useEffect } from "react";
import {
  generateTimeSlots,
  getOpeningPeriodForDate,
  isPastSlot,
  isReservationOverlapping,
} from "../../utils/reservationTime";

const TimePicker = ({
  openingHours,
  handleButtonClick,
  bayBookedTimeList,
  selectedDate,
}) => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [isMorningSelected, setIsMorningSelected] = useState(true);

  useEffect(() => {
    setSelectedTime(null);
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
      <div>
        <button
          onClick={() => setIsMorningSelected(true)}
          className={`p-1 rounded-l-xl border w-1/2 ${
            isMorningSelected ? "bg-primary text-white" : "bg-white"
          } `}
        >
          오전
        </button>
        <button
          onClick={() => setIsMorningSelected(false)}
          className={`p-1 rounded-r-xl border w-1/2 ${
            !isMorningSelected ? "bg-primary text-white" : "bg-white"
          } `}
        >
          오후
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="grid w-full grid-cols-4 gap-2">
          {currentHours.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeClick(time)}
              disabled={isScheduled(time) || isPastSlot(selectedDate, time)}
              aria-pressed={selectedTime === time}
              className={`p-4 border rounded-xl ${
                selectedTime === time ? "bg-primary text-white" : "bg-white"
              } ${
                (isScheduled(time) || isPastSlot(selectedDate, time)) &&
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
