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
      <div className="grid w-full grid-cols-4 gap-2">
        {durations.map((duration) => (
          <button
            key={duration}
            type="button"
            onClick={() => handleDurationClick(duration)}
            disabled={!availableDurations.includes(duration)}
            aria-pressed={selectedDuration === duration}
            className={`px-2 py-3 font-medium border border-gray-300 rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              selectedDuration === duration
                ? "border-primary bg-primary text-white hover:brightness-95"
                : "bg-white text-gray-800 hover:border-primary hover:bg-sky-50"
            } ${
              !availableDurations.includes(duration) &&
              "opacity-50 cursor-not-allowed"
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
