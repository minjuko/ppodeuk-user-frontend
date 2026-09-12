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
            onClick={() => handleDurationClick(duration)}
            disabled={!availableDurations.includes(duration)}
            aria-pressed={selectedDuration === duration}
            className={`p-4 border rounded-xl ${
              selectedDuration === duration
                ? "bg-primary text-white rounded-md"
                : "bg-white rounded-md"
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
