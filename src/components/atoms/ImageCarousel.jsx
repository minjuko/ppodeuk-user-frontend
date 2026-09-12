import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  function handleChange(index) {
    setCurrentIndex(index);
  }

  const renderSlides = images.map((image, index) => (
    <div key={index}>
      <img src={image.url} alt={image.alt} className="h-56" />
    </div>
  ));

  return (
    <div className="relative flex items-center justify-center">
      <Carousel
        showArrows={true}
        showStatus={false}
        showIndicators={true}
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        selectedItem={currentIndex}
        onChange={handleChange}
      >
        {renderSlides}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
