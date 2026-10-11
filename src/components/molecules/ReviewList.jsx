import ReviewItem from "../atoms/ReviewItem";

const ReviewList = ({ reviews }) => {
  return (
    <div className="px-4 bg-white border border-gray-200 rounded-lg">
      {reviews.map((review, index) => (
        <div key={`${review.username}-${review.date}-${index}`}>
          <ReviewItem
            rating={review.rating}
            username={review.username}
            date={review.date}
            content={review.content}
          />
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
