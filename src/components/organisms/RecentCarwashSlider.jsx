import { RecentCarwashItem } from "../molecules/RecentCarwashItem";

export const RecentCarwashSlider = ({ recentList }) => {
  return (
    <div className="flex gap-4 overflow-x-auto flex-nowrap scrollbar-hide">
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
