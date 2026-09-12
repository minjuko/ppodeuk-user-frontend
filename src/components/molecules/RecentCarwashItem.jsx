import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCarwashId } from "../../store/action";

export const RecentCarwashItem = ({
  image,
  carwashId,
  reservationDate,
  carwashName,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleItemClick = () => {
    dispatch(setCarwashId(carwashId));
    navigate(`/carwashdetail/${carwashId}`);
  };

  return (
    <div
      className="w-24"
      onClick={handleItemClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") handleItemClick();
      }}
      role="button"
      tabIndex={0}
    >
      <div className="relative w-24 h-24 overflow-hidden rounded-xl bg-slate-600">
        {image ? (
          <img
            src={image.url}
            alt={`${carwashName} 사진`}
            className="absolute top-0 object-cover w-24 h-24"
          />
        ) : (
          <img
            src="/CarwashDetail/CarwashImgNotFound.png"
            alt="이미지 없음"
            className="absolute top-0 object-cover w-24 h-24"
          />
        )}
      </div>
      <div className="text-xs text-center text-gray-500">{reservationDate}</div>
      <div className="overflow-hidden text-sm text-center text-ellipsis whitespace-nowrap">
        {carwashName}
      </div>
    </div>
  );
};
