import LocationIcon from "/location_blue.svg";

const DistanceFromHere = ({ distance, className }) => {
  const distanceInMeters = Math.round(Number(distance));
  const formattedDistance =
    distanceInMeters >= 1000
      ? `${(distanceInMeters / 1000).toFixed(1)}km`
      : `${distanceInMeters}m`;

  return (
    <div className={`text-center ${className}`}>
      <img className="inline w-5 h-5" src={LocationIcon} alt="위치 아이콘" />
      <div className="text-sm font-semibold leading-5 text-primary">
        {formattedDistance}
      </div>
    </div>
  );
};

export default DistanceFromHere;
