const getSelected = (selected) => {
  switch (selected) {
    case "selected":
      return "w-14 h-14 absolute border-4 rounded-md border-sky-300";
    case "unselected":
      return "w-14 h-14 absolute border-4 rounded-md border-black";
    default:
      return "";
  }
};

export const CarwashPin = ({ picurl = "", selected, alt }) => {
  return (
    <div className="relative h-16 w-14">
      <div className="absolute top-0 left-0 w-14 h-14">
        <div
          className={`${
            selected ? getSelected("selected") : getSelected("unselected")
          }`}
        >
          <img
            className="absolute top-0 left-0 w-12 h-12 rounded"
            src={picurl}
            alt={alt || "세차장"}
          />
        </div>
      </div>
      <div className="w-5 h-6 left-[19px] top-[43px] absolute">
        <img
          className="absolute top-0 left-0 w-5 h-6"
          src={`${
            selected
              ? "src/assets/images/pin_selected.png"
              : "src/assets/images/pin_unselected.png"
          }`}
          alt="지도 핀"
        />
      </div>
    </div>
  );
};
