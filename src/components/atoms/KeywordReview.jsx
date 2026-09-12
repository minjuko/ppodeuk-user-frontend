const KeywordReview = ({ keyword, reviewCount, totalReviews }) => {
  const fillPercentage = (reviewCount / totalReviews) * 100;

  return (
    <div className="relative flex items-center justify-between w-auto p-2 text-gray-700 bg-gray-200 rounded-lg">
      <div className="text-sm font-semibold text-black">{keyword}</div>
      <div className="text-sm font-semibold text-primary">{reviewCount}</div>
      <div
        className="absolute top-0 left-0 h-full rounded-lg opacity-20 bg-primary"
        style={{
          width: `${fillPercentage}%`,
        }}
      ></div>
    </div>
  );
};

export default KeywordReview;
