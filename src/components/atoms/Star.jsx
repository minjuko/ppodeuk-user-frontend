import StarImg from "/StarPicker/checkedstar.svg";

const Star = ({ starCount, reviewCount }) => {
  return (
    <div className="flex items-center gap-1">
      <img className="w-3 h-3" src={StarImg} alt="별 아이콘" />
      <div className="text-sm text-black">{starCount}</div>
      {reviewCount > 0 && (
        <div className="text-sm text-neutral-500">({reviewCount})</div>
      )}
    </div>
  );
};

export default Star;
