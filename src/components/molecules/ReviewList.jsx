import ReviewItem from "../atoms/ReviewItem";

const ReviewList = ({ reviews }) => {
  return (
    <div className="grid gap-2">
      {reviews.map((review, index) => (
        <div key={index}>
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
