const SectionSkeleton = ({ rows = 3, label = "내용을 불러오는 중입니다." }) => (
  <div className="grid gap-3" role="status" aria-label={label}>
    {Array.from({ length: rows }, (_, index) => (
      <div key={index} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
    ))}
  </div>
);

export default SectionSkeleton;
