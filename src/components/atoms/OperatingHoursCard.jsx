import TimeImage from "/StoreInfo/Time.svg";

const displayEndTime = (time) => (time === "00:00" ? "24:00" : time);

const OperatingHoursCard = ({ openingHours }) => (
  <section
    className="flex items-center gap-3 p-3 bg-sky-50 border border-sky-200 rounded-lg"
    aria-labelledby="operating-hours-title"
  >
    <div className="flex items-center justify-center w-10 h-10 bg-white border border-sky-100 rounded-lg shrink-0">
      <img src={TimeImage} alt="" className="w-6 h-6" />
    </div>
    <div className="grid min-w-0 gap-1.5">
      <h2
        id="operating-hours-title"
        className="text-sm font-bold text-gray-900"
      >
        영업시간
      </h2>
      <div className="flex items-center gap-2 text-xs whitespace-nowrap">
        <p className="flex items-center gap-1">
          <span className="px-1.5 py-0.5 font-bold text-sky-700 bg-white rounded">
            평일
          </span>
          <span className="font-medium text-gray-700">
            {openingHours.weekday.start}~
            {displayEndTime(openingHours.weekday.end)}
          </span>
        </p>
        <span className="w-px h-3 bg-sky-200" aria-hidden="true" />
        <p className="flex items-center gap-1">
          <span className="px-1.5 py-0.5 font-bold text-sky-700 bg-white rounded">
            주말
          </span>
          <span className="font-medium text-gray-700">
            {openingHours.weekend.start}~
            {displayEndTime(openingHours.weekend.end)}
          </span>
        </p>
      </div>
    </div>
  </section>
);

export default OperatingHoursCard;
