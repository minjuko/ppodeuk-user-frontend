import { useState } from "react";
import TabInfo from "../atoms/TabInfo";
import TabReview from "../atoms/TabReview";

export const Tab = ({ introduction, carwashId }) => {
  const [currentTab, setCurrentTab] = useState(0);

  const menuArr = [
    { name: "정보", content: <TabInfo introduction={introduction} /> },
    { name: "평가", content: <TabReview carwashId={carwashId} /> },
  ];

  const selectMenuHandler = (index) => {
    setCurrentTab(index);
  };

  return (
    <div>
      <ul
        className="flex items-center font-bold text-gray-800 bg-gray-300"
        role="tablist"
      >
        {menuArr.map((item, index) => (
          <li
            className={`w-1/2 p-4 text-center transition duration-500 ${
              index === currentTab &&
              "border border-gray-300 bg-white text-black"
            }`}
            key={index}
          >
            <button
              type="button"
              role="tab"
              className="w-full"
              aria-selected={index === currentTab}
              onClick={() => selectMenuHandler(index)}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
      <div className="p-4">{menuArr[currentTab].content}</div>
    </div>
  );
};
