import React, { useState } from 'react';
import "./style.css";

type ImageSliderProps = {
    images: string[];
  };

  
const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
    const [current, setCurrent] = useState<number>(0);
    const length = images.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(images) || images.length <= 0) {
    return null;
  }

  return (
    <section className="slider">
      <button className="left-arrow" onClick={prevSlide}>&lt;</button>
      <button className="right-arrow" onClick={nextSlide}>&gt;</button>
      {images.map((image, index) => {
        return (
          <div className={index === current ? 'slide active' : 'slide'} key={index}>
            {index === current && (
              <img src={image} alt={'image ' + index} className="image" />
            )}
          </div>
        );
      })}
    </section>
  );
};

export default ImageSlider;
