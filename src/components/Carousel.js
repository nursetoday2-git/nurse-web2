import React, { useState } from 'react';
import '../styles/Carousel.css';

const car1 = `${process.env.PUBLIC_URL}/car1.jpeg`;
const car2 = `${process.env.PUBLIC_URL}/car2.jpeg`;
const car3 = `${process.env.PUBLIC_URL}/car3.jpeg`;
const car4 = `${process.env.PUBLIC_URL}/car4.jpeg`;
const car5= `${process.env.PUBLIC_URL}/c2.jpeg`;
const car6 = `${process.env.PUBLIC_URL}/c3.jpeg`;
const car7 = `${process.env.PUBLIC_URL}/c4.jpeg`;
const car8 = `${process.env.PUBLIC_URL}/c5.jpeg`;
const car9 = `${process.env.PUBLIC_URL}/c6.jpeg`;
const car10 = `${process.env.PUBLIC_URL}/c7.jpeg`;
const car11 = `${process.env.PUBLIC_URL}/c8.jpeg`;
const car12 = `${process.env.PUBLIC_URL}/c9.jpeg`;
const car13 = `${process.env.PUBLIC_URL}/c10.jpeg`;


function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);



  // Sample images - replace with your actual image paths
  const images = [
    { src: car1, alt: 'Professional nursing care' },
    { src: car2, alt: 'Home healthcare services' },
    { src: car3, alt: 'Patient consultation' },
    { src: car4, alt: 'Medical equipment' },
    { src: car5, alt: 'Nurse assisting patient' },
    { src: car6, alt: 'Health monitoring' },
    { src: car7, alt: 'Elderly care' },
    { src: car8, alt: 'Pediatric nursing' },
    { src: car9, alt: 'Wound care' },
    { src: car10, alt: 'Medication management' },
    { src: car11, alt: 'Physical therapy assistance' },
    { src: car12, alt: 'Chronic disease management' },
    { src: car13, alt: 'Telehealth services' },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="carousel-section">
      <div className="carousel-container">
        <h2 className="carousel-heading">Gallery</h2>
        
        <div className="carousel-wrapper">
          <button 
            className="carousel-button carousel-button-prev" 
            onClick={prevSlide}
            aria-label="Previous image"
          >
            ‹
          </button>

          <div className="carousel-track">
            <div 
              className="carousel-slides"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((image, index) => (
                <div key={index} className="carousel-slide">
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="carousel-image"
                  />
                </div>
              ))}
            </div>
          </div>

          <button 
            className="carousel-button carousel-button-next" 
            onClick={nextSlide}
            aria-label="Next image"
          >
            ›
          </button>
        </div>

        <div className="carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        <div className="carousel-counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </section>
  );
}

export default Carousel;