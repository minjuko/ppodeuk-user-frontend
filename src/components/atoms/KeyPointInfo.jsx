const KeyPointInfo = ({ selectedPoints }) => {
  const keypointToText = {
    8: "하부세차",
    9: "개러지형 독립공간",
    10: "야간조명",
    11: "100% 수돗물",
    12: "휴게실",
    13: "에어컨",
    14: "발수코팅건",
  };

  return (
    <section className="keypoint-info-section border-y border-gray-200 bg-white px-4 py-3 md:px-5 md:py-4">
      <h2 className="mb-3 text-base font-bold">키포인트</h2>
      <ul className="keypoint-chip-row" aria-label="세차장 주요 편의시설">
        {selectedPoints.map((point) => (
          <li
            className="ui-chip ui-chip-soft ui-chip-md shrink-0 text-gray-900 md:h-10 md:px-5 md:text-base"
            key={point}
          >
            {keypointToText[point]}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default KeyPointInfo;
