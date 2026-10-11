import ProfileImg from "/StoreInfo/Profile.svg";
import Star from "./Star";

const ReviewItem = ({ rating, username, date, content }) => (
  <article className="grid gap-3 py-4 border-b border-gray-200 last:border-b-0">
    <header className="flex items-start justify-between gap-3">
      <div className="flex items-center min-w-0 gap-2">
        <span className="flex items-center justify-center w-8 h-8 shrink-0">
          <img src={ProfileImg} alt="" className="w-6 h-6" />
        </span>
        <div className="grid min-w-0 gap-0.5">
          <strong className="text-sm text-gray-900 truncate">{username}</strong>
          <Star starCount={rating} />
        </div>
      </div>
      <time className="px-2 py-1 text-xs font-medium text-sky-700 bg-white border border-sky-200 rounded-md whitespace-nowrap">
        {date}
      </time>
    </header>
    <p className="text-sm leading-6 text-gray-800 whitespace-pre-wrap">
      {content}
    </p>
  </article>
);

export default ReviewItem;
