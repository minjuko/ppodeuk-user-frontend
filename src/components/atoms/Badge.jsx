import { useState } from "react";

const getType = (type) => {
  switch (type) {
    case "unclicked":
      return "flex items-center align-middle w-auto px-3.5 py-1 leading-normal text-center text-black bg-gray-100 rounded-full border border-slate-300";
    case "onclicked":
      return "flex items-center align-middle w-auto px-3.5 py-1 leading-normal text-center text-white bg-primary rounded-full";
    default:
      return "";
  }
};

export const Badge = ({ id, label, onClick, className }) => {
  const [isChecked, setIsChecked] = useState(false);

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
    if (onClick) {
      onClick({ id, isChecked: !isChecked });
    }
  };

  return (
    <div className="field">
      <label
        className={`${
          isChecked ? getType("onclicked") : getType("unclicked")
        } ${className}`}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={toggleCheckbox}
          className="hidden"
        />
        {label}
      </label>
    </div>
  );
};
