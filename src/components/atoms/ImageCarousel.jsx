import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "./Image";

const ArrowButton = ({ direction, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`absolute top-1/2 z-10 flex items-center justify-center w-7 h-7 -translate-y-1/2 text-white bg-gray-900/45 shadow-sm rounded-full transition hover:bg-gray-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
      direction === "previous" ? "left-3" : "right-3"
    }`}
  >
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={direction === "previous" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  </button>
);

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultipleImages = images.length > 1;

  const renderSlides = images.map((image, index) => (
    <div key={`${image.url}-${index}`}>
      <Image
        src={image.url}
        alt={image.alt}
        className="object-cover w-full h-48 md:h-64"
      />
    </div>
  ));

  return (
    <div className="relative -mx-4 -mt-4 flex w-[calc(100%+2rem)] items-center justify-center overflow-hidden">
      <Carousel
        className="w-full max-w-full"
        showArrows={hasMultipleImages}
        showStatus={false}
        showIndicators={hasMultipleImages}
        autoPlay={false}
        infiniteLoop={hasMultipleImages}
        showThumbs={false}
        selectedItem={currentIndex}
        onChange={setCurrentIndex}
        renderArrowPrev={(onClick) =>
          hasMultipleImages && (
            <ArrowButton
              direction="previous"
              onClick={onClick}
              label="이전 이미지"
            />
          )
        }
        renderArrowNext={(onClick) =>
          hasMultipleImages && (
            <ArrowButton
              direction="next"
              onClick={onClick}
              label="다음 이미지"
            />
          )
        }
      >
        {renderSlides}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
