import ProfileImg from "/StoreInfo/Profile.svg";
import Image from "./Image";
import Star from "./Star";

const ReviewItem = ({ rating, username, date, content }) => {
  return (
    <div className="grid gap-2 p-4 text-sm border border-gray-300 rounded-xl">
      <Star starCount={rating} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 font-semibold">
          <Image src={ProfileImg} alt="닉네임" />
          <div>{username}</div>
        </div>
        <div>{date}</div>
      </div>
      <p>{content}</p>
    </div>
  );
};

export default ReviewItem;
