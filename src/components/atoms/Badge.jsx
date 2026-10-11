import { useState } from "react";

const getType = (isChecked) =>
  isChecked ? "ui-chip-active" : "border-primary bg-white text-gray-900";

export const Badge = ({ id, label, onClick, className }) => {
  const [isChecked, setIsChecked] = useState(false);

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
    if (onClick) onClick({ id, isChecked: !isChecked });
  };

  return (
    <div className="field">
      <label
        className={`ui-chip ui-chip-md cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${getType(
          isChecked,
        )} ${className}`}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={toggleCheckbox}
          className="sr-only"
        />
        {label}
      </label>
    </div>
  );
};
