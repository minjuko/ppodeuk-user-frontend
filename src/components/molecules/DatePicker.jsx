import { useEffect, useState } from "react";
import { getDemoDate } from "../../utils/demoDate";

const DatePicker = ({
  handleButtonClick,
  selectedDate: controlledDate,
  className = "",
}) => {
  const [selectedDate, setSelectedDate] = useState(
    controlledDate || getDemoDate(),
  );

  useEffect(() => {
    if (controlledDate) setSelectedDate(controlledDate);
  }, [controlledDate]);

  const handleClick = (date) => {
    setSelectedDate(date);
    handleButtonClick(date);
  };

  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(getDemoDate());
    date.setDate(date.getDate() + index);
    return date;
  });

  return (
    <div
      className={`p-3 bg-white border border-gray-300 rounded-lg shadow-sm ${className}`}
    >
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date) => {
          const isSelected =
            selectedDate.toDateString() === date.toDateString();
          const day = date.getDay();
          return (
            <button
              type="button"
              key={date.toDateString()}
              className="flex flex-col items-center gap-1 py-1 rounded-md transition hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-pressed={isSelected}
              onClick={() => handleClick(date)}
            >
              <span
                className={`text-xs font-medium ${
                  day === 0
                    ? "text-red-500"
                    : day === 6
                    ? "text-blue-500"
                    : "text-gray-500"
                }`}
              >
                {date.toLocaleDateString("ko-KR", { weekday: "short" })}
              </span>
              <span
                className={`flex items-center justify-center w-9 h-9 text-sm rounded-full ${
                  isSelected
                    ? "font-bold text-white bg-primary shadow-sm"
                    : "font-semibold text-gray-800"
                }`}
              >
                {date.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DatePicker;
