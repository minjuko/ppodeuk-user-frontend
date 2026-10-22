import TimeImage from "/StoreInfo/Time.svg";

const displayEndTime = (time) => (time === "00:00" ? "24:00" : time);

const OperatingHoursCard = ({ openingHours }) => (
  <section
    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3"
    aria-labelledby="operating-hours-title"
  >
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
      <img src={TimeImage} alt="" className="w-6 h-6" />
    </div>
    <div className="grid min-w-0 gap-1.5">
      <h2
        id="operating-hours-title"
        className="text-sm font-bold text-slate-800"
      >
        영업시간
      </h2>
      <dl className="grid min-w-0 grid-cols-2 gap-3">
        <div className="flex min-w-0 flex-col items-start gap-0.5">
          <dt className="text-xs font-medium text-slate-500">평일</dt>
          <dd className="whitespace-nowrap text-sm font-semibold text-slate-800">
            {openingHours.weekday.start}–
            {displayEndTime(openingHours.weekday.end)}
          </dd>
        </div>
        <div className="flex min-w-0 flex-col items-start gap-0.5">
          <dt className="text-xs font-medium text-slate-500">주말</dt>
          <dd className="whitespace-nowrap text-sm font-semibold text-slate-800">
            {openingHours.weekend.start}–
            {displayEndTime(openingHours.weekend.end)}
          </dd>
        </div>
      </dl>
    </div>
  </section>
);

export default OperatingHoursCard;
