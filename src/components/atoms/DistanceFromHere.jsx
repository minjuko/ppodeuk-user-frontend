import LocationIcon from "/location_blue.svg";

const DistanceFromHere = ({ distance, className }) => {
  return (
    <div className={`text-center ${className}`}>
      <img className="inline w-6 h-6" src={LocationIcon} alt="위치 아이콘" />
      <div className="text-primary">
        {distance >= 1000
          ? (distance / 1000).toFixed(1) + "km"
          : distance + "km"}
      </div>
    </div>
  );
};

export default DistanceFromHere;
