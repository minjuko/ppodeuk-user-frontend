import BayItem from "../molecules/BayItem";

const BayList = ({ bays, openingHours, selectedDate, onClick }) => {
  return (
    <div className="reservation-bay-list grid gap-3">
      {bays.map((item) => (
        <BayItem
          key={item.bayId}
          bayId={item.bayId}
          bayNo={item.bayNo}
          bayBookedTimeList={item.bayBookedTimeList}
          openingHours={openingHours}
          selectedDate={selectedDate}
          onClick={() => onClick(item.bayId)}
        />
      ))}
    </div>
  );
};

export default BayList;
