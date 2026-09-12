import { useState } from "react";
import { Badge } from "../atoms/Badge";

export const BadgeSet = ({ keywords, onSelectKeyword }) => {
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  const handleSelect = ({ id, isChecked }) => {
    let updatedSelectedKeywords;
    if (isChecked) {
      updatedSelectedKeywords = [...selectedKeywords, id];
    } else {
      updatedSelectedKeywords = selectedKeywords.filter(
        (itemId) => itemId !== id,
      );
    }
    setSelectedKeywords(updatedSelectedKeywords);
    onSelectKeyword(updatedSelectedKeywords);
  };

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {keywords.map((keyword) => (
        <Badge
          key={keyword.id}
          id={keyword.id}
          label={keyword.keyword}
          onClick={(data) => handleSelect(data)}
        />
      ))}
    </div>
  );
};
