const DEFAULT_FALLBACK_SRC = "/CarwashDetail/CarwashImgNotFound.png";

const Image = ({ className, src, alt, fallbackSrc = DEFAULT_FALLBACK_SRC }) => {
  const handleError = (event) => {
    const image = event.currentTarget;
    if (image.dataset.fallbackApplied === "true") return;

    image.dataset.fallbackApplied = "true";
    image.src = fallbackSrc;
  };

  return (
    <picture className={className}>
      <source srcSet={src} />
      <img className={className} src={src} alt={alt} onError={handleError} />
    </picture>
  );
};

export default Image;
