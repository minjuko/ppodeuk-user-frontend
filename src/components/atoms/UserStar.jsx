import React, { useId } from "react";

const UserStar = ({ averageStar }) => {
  const uniqueId = useId();
  const STAR_IDX_ARR = ["1", "2", "3", "4", "5"];

  const calculateStarRates = () => {
    let tempStarRatesArr = [0, 0, 0, 0, 0];
    let starVerScore = (averageStar * 70) / 5;
    let idx = 0;
    while (starVerScore >= 14 && idx < tempStarRatesArr.length - 1) {
      tempStarRatesArr[idx] = 14;
      idx += 1;
      starVerScore -= 14;
    }
    tempStarRatesArr[idx] += starVerScore;
    return tempStarRatesArr;
  };

  const ratesResArr = calculateStarRates();

  return (
    <div className="flex items-center text-sm">
      {STAR_IDX_ARR.map((item, idx) => (
        <div className="star_icon" key={`${uniqueId}-${item}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 13"
            fill="#F4F4F4">
            <clipPath id={`clip-${uniqueId}-${item}`}>
              <rect width={ratesResArr[idx]} height="13" />
            </clipPath>
            <path
              id={`star-${uniqueId}-${item}`}
              d="M9,2l2.163,4.279L16,6.969,12.5,10.3l.826,4.7L9,12.779,4.674,15,5.5,10.3,2,6.969l4.837-.69Z"
              transform="translate(-2 -2)"
            />
            <use
              clipPath={`url(#clip-${uniqueId}-${item})`}
              xlinkHref={`#star-${uniqueId}-${item}`}
              fill="#FABF35"
            />
          </svg>
        </div>
      ))}
      <div className="ml-2">{averageStar.toFixed(1)}점</div>
    </div>
  );
};

export default UserStar;
