import { useQuery } from "@tanstack/react-query";
import { carwashesReviews } from "../../apis/carwashes";
import ReviewList from "../molecules/ReviewList";
import KeywordReview from "./KeywordReview";
import UserStar from "./UserStar";
import Loader from "./Loader";

const TabReview = ({ carwashId }) => {
  const {
    data: reviewsData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["carwashesReviews", carwashId],
    queryFn: () => carwashesReviews(carwashId),
    enabled: Boolean(carwashId),
  });

  const averageStar = reviewsData?.data?.response?.overview?.rate || 0;
  const totalReviews = reviewsData?.data?.response?.overview?.totalCnt || 0;
  const keywords =
    reviewsData?.data?.response?.overview?.reviewKeywordList || [];

  const carwashreviews =
    reviewsData?.data?.response?.reviewList?.map((review) => ({
      rating: review.rate,
      username: review.username,
      date: review.created_at.split("T")[0],
      content: review.comment,
    })) || [];

  const getKeywordText = (id) => {
    const keywordMapping = {
      1: "사장님이 친절해요",
      2: "간단한 용품을 팔아요",
      3: "휴게공간이 있어요",
      4: "가격이 합리적이에요",
      5: "타이어 공기를 넣을 수 있어요",
      6: "매장이 깨끗해요",
      7: "여름엔 시원하고 겨울엔 깨끗해요",
    };

    return keywordMapping[id] || "존재하지 않음";
  };

  if (isPending)
    return <Loader variant="inline" label="리뷰를 불러오는 중입니다." />;
  if (isError) return <div role="alert">리뷰를 불러오지 못했습니다.</div>;

  return (
    <div>
      <div className="grid-4">
        <section className="grid gap-2">
          <h2 className="font-semibold">평균별점</h2>
          <UserStar averageStar={averageStar} />
        </section>
        <hr />
        <section className="grid gap-2">
          <h2 className="font-semibold">키워드 리뷰</h2>
          <div className="grid gap-2">
            {keywords.map((keywordData) => (
              <KeywordReview
                key={keywordData.id}
                keyword={getKeywordText(keywordData.id)}
                reviewCount={keywordData.count}
                totalReviews={totalReviews}
              />
            ))}
          </div>
        </section>
        <hr />
        <section className="grid gap-2">
          <h2 className="font-semibold">
            리뷰 {carwashreviews?.length || 0}건
          </h2>
          <ReviewList reviews={carwashreviews} />
        </section>
      </div>
    </div>
  );
};

export default TabReview;
