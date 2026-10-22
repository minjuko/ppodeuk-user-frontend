const BrandLogo = ({ className = "" }) => (
  <span className={`inline-flex shrink-0 items-center gap-2 ${className}`}>
    <img src="/bdbd_icon.svg" className="h-6 w-5" alt="" />
    <img src="/bdbd.svg" className="h-auto w-24" alt="뽀득뽀득" />
  </span>
);

export default BrandLogo;
