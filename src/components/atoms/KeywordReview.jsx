const KeywordReview = ({ keyword, reviewCount, totalReviews }) => {
  const fillPercentage = totalReviews ? (reviewCount / totalReviews) * 100 : 0;

  return (
    <div className="relative flex items-center justify-between w-auto min-h-11 px-3 py-2 overflow-hidden border rounded-lg border-sky-100 bg-sky-50">
      <div
        className="absolute inset-y-0 left-0 bg-sky-100"
        style={{ width: `${fillPercentage}%` }}
        aria-hidden="true"
      />
      <div className="relative z-10 text-sm font-semibold text-gray-800">
        {keyword}
      </div>
      <div className="relative z-10 text-sm font-bold text-primary">
        {reviewCount}
      </div>
    </div>
  );
};

export default KeywordReview;
