const KeyPointInfo = ({ selectedPoints }) => {
  const keypointToText = {
    8: { text: "하부세차", icon: "/CarwashDetail/underside.svg" },
    9: { text: "개러지형 독립공간", icon: "/CarwashDetail/garage.svg" },
    10: { text: "야간조명", icon: "/CarwashDetail/light.svg" },
    11: { text: "100% 수돗물", icon: "/CarwashDetail/tapwater.svg" },
    12: { text: "휴게실", icon: "/CarwashDetail/breakroom.svg" },
    13: { text: "에어컨", icon: "/CarwashDetail/ac.svg" },
    14: { text: "발수코팅건", icon: "/CarwashDetail/waterproof.svg" },
  };

  return (
    <section className="grid gap-2 p-4 bg-gray-100 rounded-lg">
      <h2 className="font-semibold">키포인트</h2>
      <div className="grid grid-cols-2 gap-2">
        {selectedPoints.map((point) => (
          <div className="flex items-center text-sm" key={point}>
            <img
              src={keypointToText[point].icon}
              alt={keypointToText[point].text}
              className="w-4 h-4 mr-2"
            />
            {keypointToText[point].text}
          </div>
        ))}
      </div>
    </section>
  );
};

export default KeyPointInfo;
