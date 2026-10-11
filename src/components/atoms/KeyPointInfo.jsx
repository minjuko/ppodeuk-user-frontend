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
    <section className="px-4 py-4 bg-white border-gray-200 border-y">
      <h2 className="mb-3 text-base font-bold">키포인트</h2>
      <ul
        className="flex flex-wrap max-w-full min-w-0 gap-2.5"
        aria-label="세차장 주요 편의시설"
      >
        {selectedPoints.map((point) => (
          <li
            className="ui-chip ui-chip-md border-primary bg-white text-gray-900"
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
