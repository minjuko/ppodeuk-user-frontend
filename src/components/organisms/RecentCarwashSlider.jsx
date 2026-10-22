import { RecentCarwashItem } from "../molecules/RecentCarwashItem";

export const RecentCarwashSlider = ({ recentList }) => {
  return (
    <div className="flex gap-4 overflow-x-auto flex-nowrap scrollbar-hide md:grid md:grid-cols-4 md:gap-3 md:overflow-visible">
      {recentList.map((item) => (
        <RecentCarwashItem
          key={`${item.carwashId}-${item.date}`}
          image={item.image}
          carwashId={item.carwashId}
          reservationDate={item.date}
          carwashName={item.carwashName}
        />
      ))}
    </div>
  );
};
