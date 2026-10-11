import { useState } from "react";
import TabInfo from "../atoms/TabInfo";
import TabReview from "../atoms/TabReview";

export const Tab = ({ introduction, carwashId }) => {
  const [currentTab, setCurrentTab] = useState(0);

  const menuArr = [
    { name: "정보", content: <TabInfo introduction={introduction} /> },
    { name: "평가", content: <TabReview carwashId={carwashId} /> },
  ];

  return (
    <div className="bg-white">
      <div
        className="flex border-t border-gray-200"
        role="tablist"
        aria-label="세차장 상세 메뉴"
      >
        {menuArr.map((item, index) => {
          const isSelected = index === currentTab;
          return (
            <button
              type="button"
              role="tab"
              id={`carwash-tab-${index}`}
              aria-controls={`carwash-panel-${index}`}
              aria-selected={isSelected}
              className={`relative flex-1 py-3 text-sm font-semibold transition-colors ${
                isSelected
                  ? "text-primary after:absolute after:inset-x-5 after:bottom-0 after:h-0.5 after:bg-primary"
                  : "text-gray-500"
              }`}
              key={item.name}
              onClick={() => setCurrentTab(index)}
            >
              {item.name}
            </button>
          );
        })}
      </div>
      <div
        id={`carwash-panel-${currentTab}`}
        role="tabpanel"
        aria-labelledby={`carwash-tab-${currentTab}`}
        className="p-4"
      >
        {menuArr[currentTab].content}
      </div>
    </div>
  );
};
