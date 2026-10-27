import { useState, useEffect } from "react";
import {
  getAvailableDurations,
  getOpeningPeriodForDate,
  RESERVATION_DURATIONS,
} from "../../utils/reservationTime";

const DurationPicker = ({
  handleButtonClick,
  startTime,
  bayBookedTimeList,
  selectedDate,
  openingHours,
  className = "",
}) => {
  const [selectedDuration, setSelectedDuration] = useState();
  const durations = RESERVATION_DURATIONS;
  useEffect(() => {
    setSelectedDuration(null);
  }, [selectedDate, startTime]);
  const availableDurations = getAvailableDurations({
    selectedDate,
    startTime,
    openingPeriod: getOpeningPeriodForDate(openingHours, selectedDate),
    bookedTimeList: bayBookedTimeList,
    durations,
  });
  const handleDurationClick = (duration) => {
    setSelectedDuration(duration);
    handleButtonClick(duration);
  };
  return (
    <div>
      <div className={`grid w-full grid-cols-4 gap-2 ${className}`}>
        {durations.map((duration) => (
          <button
            key={duration}
            type="button"
            onClick={() => handleDurationClick(duration)}
            disabled={!availableDurations.includes(duration)}
            aria-pressed={selectedDuration === duration}
            className={`min-h-11 whitespace-nowrap rounded-lg border border-gray-300 px-1 py-2 text-sm font-medium leading-none transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:py-3 disabled:bg-gray-100 disabled:text-gray-700 disabled:hover:border-gray-300 disabled:hover:bg-gray-100 disabled:hover:text-gray-700 ${
              selectedDuration === duration
                ? "border-primary bg-primary text-white hover:brightness-95"
                : "bg-white text-gray-800 hover:border-primary hover:bg-sky-50"
            } ${
              !availableDurations.includes(duration) && "cursor-not-allowed"
            }`}
          >
            {duration}분
          </button>
        ))}
      </div>
    </div>
  );
};
export default DurationPicker;
