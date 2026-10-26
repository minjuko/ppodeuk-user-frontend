import DistanceFromHere from "../atoms/DistanceFromHere";
import UserStar from "../atoms/UserStar";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Image from "../atoms/Image";
import { setCarwashId } from "../../store/action";
import { parseReservationRouteId } from "../../utils/reservationRoute";

const StoreItem = ({
  carwashId,
  imgsrc,
  storename,
  starcount,
  priceinfo,
  distance,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    const parsedCarwashId = parseReservationRouteId(carwashId);
    if (parsedCarwashId === null) return;
    dispatch(setCarwashId(parsedCarwashId));
    navigate(`/carwashdetail/${parsedCarwashId}`);
  };

  const imageUrl = imgsrc
    ? imgsrc.url
    : "/CarwashDetail/CarwashImgNotFound.png";

  return (
    <div
      className="relative flex items-center gap-2.5 p-2.5 bg-white border border-gray-300 rounded-xl"
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") handleClick();
      }}
      role="button"
      tabIndex={0}
    >
      <div className="w-[72px] h-[72px] overflow-hidden rounded-lg shrink-0">
        <Image
          className="object-cover w-full h-full"
          src={imageUrl}
          alt="세차장이미지"
        />
      </div>
      <div className="grid min-w-0 flex-grow gap-1">
        <UserStar averageStar={starcount} />
        <div className="w-4/5 overflow-hidden font-semibold leading-5 text-ellipsis whitespace-nowrap">
          {storename}
        </div>
        <strong className="text-base font-extrabold leading-5 text-primary">
          {priceinfo.toLocaleString()}원
          <span className="font-bold text-gray-600"> / 30분</span>
        </strong>
      </div>
      <DistanceFromHere className="absolute right-2.5" distance={distance} />
    </div>
  );
};

export default StoreItem;
