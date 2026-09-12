import DistanceFromHere from "../atoms/DistanceFromHere";
import UserStar from "../atoms/UserStar";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

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
    dispatch({ type: "SET_CARWASH_ID", payload: carwashId });
    navigate(`/carwashdetail/${carwashId}`);
  };

  const imageUrl = imgsrc
    ? imgsrc.url
    : "/CarwashDetail/CarwashImgNotFound.png";

  return (
    <div
      className="relative flex items-center gap-4 p-4 bg-white border border-gray-300 rounded-xl"
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") handleClick();
      }}
      role="button"
      tabIndex={0}
    >
      <div className="w-24 h-24 overflow-auto rounded-xl">
        <img
          className="object-cover w-full h-full"
          src={imageUrl}
          alt="세차장이미지"
        />
      </div>
      <div className="grid flex-grow gap-2">
        <UserStar averageStar={starcount} />
        <div className="w-4/5 overflow-hidden font-semibold text-ellipsis whitespace-nowrap">
          {storename}
        </div>
        <div className="text-primary">{priceinfo.toLocaleString()}원/30분</div>
      </div>
      <DistanceFromHere
        className="absolute right-4"
        distance={distance.toFixed(1)}
      />
    </div>
  );
};

export default StoreItem;
