import { useEffect, useState } from "react";

const DatePicker = ({ handleButtonClick, selectedDate: controlledDate }) => {
  const [selectedDate, setSelectedDate] = useState(
    controlledDate || new Date(),
  );

  useEffect(() => {
    if (controlledDate) {
      setSelectedDate(controlledDate);
    }
  }, [controlledDate]);

  const handleClick = (date) => {
    setSelectedDate(date);
    handleButtonClick(date);
  };

  const generateWeekDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const isWeekend = (date) => [0, 6].includes(date.getDay());

  const weekDates = generateWeekDates();

  return (
    <div className="p-4 rounded-lg bg-gray-50">
      <div className="flex justify-between">
        {weekDates.map((date) => (
          <button
            type="button"
            key={date.toDateString()}
            className="grid w-10 gap-2 text-center"
            aria-pressed={selectedDate.toDateString() === date.toDateString()}
            onClick={() => handleClick(date)}
          >
            {isWeekend(date) ? (
              date.getDay() === 0 ? (
                <div className="text-red-500">일</div>
              ) : (
                <div className="text-blue-500">토</div>
              )
            ) : (
              <div>
                {date.toLocaleDateString("ko-KR", { weekday: "short" })}
              </div>
            )}

            <div
              className={`${
                selectedDate.toDateString() === date.toDateString()
                  ? "bg-primary text-white rounded-full font-bold w-10 h-10 flex items-center justify-center"
                  : ""
              }`}
            >
              {date.getDate()}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DatePicker;
