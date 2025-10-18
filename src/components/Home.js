import React, { useState, useEffect, useRef } from 'react';
import "../styles/Home.css";
import Footer from './Footer';

const backgroundVideo = `${process.env.PUBLIC_URL}/video.mov`;

const aboutContent = [
  {
    title: "About Cheryl Ruthman, RN",
    text: "After more than 20 years as a registered nurse, Cheryl founded Holistic Concierge Nursing Professionals to give families personal, compassionate, and truly coordinated care. Her experience at world-class hospitals like Johns Hopkins and Hershey Medical Center showed her both the incredible resilience of patients and the challenges families face navigating a complex healthcare system. Her team manages every detail of care—from post-surgical recovery to ongoing wellness—so you can focus on what matters most: each other."
  },
  {
    title: "Our Promise",
    text: "At Holistic Concierge Nursing Professionals, we lead with empathy, serve with excellence, and earn your trust through every interaction. You don't have to navigate healthcare alone."
  }
];

function Home() {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [homeVideo, setHomeVideo] = useState(null);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);
  const [testimonialsError, setTestimonialsError] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    fetchServices();
    fetchTestimonials();
    fetchHomeVideo();
  }, []);

  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      const response = await fetch('https://nurse-back.onrender.com/home-services');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data.services || []);
      setServicesError(null);
    } catch (err) {
      setServicesError(err.message);
    } finally {
      setServicesLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      setTestimonialsLoading(true);
      const response = await fetch('https://nurse-back.onrender.com/testimonials');
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      const data = await response.json();
      setTestimonials(data.testimonials || []);
      setTestimonialsError(null);
    } catch (err) {
      setTestimonialsError(err.message);
    } finally {
      setTestimonialsLoading(false);
    }
  };

  const fetchHomeVideo = async () => {
    try {
      setVideoLoading(true);
      const response = await fetch('https://nurse-back.onrender.com/home-video');
      if (!response.ok) throw new Error('Failed to fetch video');
      const data = await response.json();
      if (data.videos && data.videos.length > 0) {
        setHomeVideo(data.videos[0]);
      }
      setVideoError(null);
    } catch (err) {
      setVideoError(err.message);
    } finally {
      setVideoLoading(false);
    }
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const containerWidth = carouselRef.current.offsetWidth;
      const scrollAmount = containerWidth;
      
      if (direction === 'left') {
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="home-body">
      {/* HERO SECTION */}
      <section className="hero-section">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Holistic Concierge Nursing</h1>
          <p>Professionals</p>
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section className="about-section">
        <h2>About Us</h2>
        <div className="about-grid">
          {aboutContent.map((item, index) => (
            <div key={index} className="about-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
        <div className="about-cta">
          <button className="cta-button">Request a Confidential Call</button>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="services-section">
        <h2>Our Services</h2>
        {servicesLoading && <div className="services-loading"><p>Loading services...</p></div>}
        {servicesError && <div className="services-error"><p>Unable to load services: {servicesError}</p></div>}
        {!servicesLoading && !servicesError && services.length === 0 && (
          <div className="services-empty"><p>No services available at the moment.</p></div>
        )}
        {!servicesLoading && !servicesError && services.length > 0 && (
          <div className="services-grid">
            {services.map((service) => (
              <div key={service._id} className="service-card">
                <div className="service-icon">
                  <img src={service.iconUrl} alt={service.title} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* HOME VIDEO SECTION */}
      {!videoLoading && !videoError && homeVideo && (
        <section className="home-video-section">
          <div className="video-content-wrapper">
            <div className="video-text-content">
              <h2>{homeVideo.title}</h2>
              {homeVideo.description && (
                <p className="video-description">{homeVideo.description}</p>
              )}
            </div>
            <div className="video-container">
              <video 
                className="feature-video" 
                controls 
                poster={homeVideo.thumbnailUrl}
              >
                <source src={homeVideo.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS SECTION - CAROUSEL */}
      <section className="testimonials-section">
        <h2>What Our Clients Say</h2>
        {testimonialsLoading && (
          <div className="testimonials-loading">
            <p>Loading testimonials...</p>
          </div>
        )}
        {testimonialsError && (
          <div className="testimonials-error">
            <p>Unable to load testimonials: {testimonialsError}</p>
          </div>
        )}
        {!testimonialsLoading && !testimonialsError && testimonials.length === 0 && (
          <div className="testimonials-empty">
            <p>No testimonials available at the moment.</p>
          </div>
        )}
        {!testimonialsLoading && !testimonialsError && testimonials.length > 0 && (
          <div className="carousel-container">
            <button 
              className="carousel-nav prev" 
              onClick={() => scrollCarousel('left')}
              aria-label="Previous testimonials"
            >
              ‹
            </button>
            
            <div className="carousel-wrapper" ref={carouselRef}>
              {testimonials.map((testimonial) => (
                <div key={testimonial._id} className="testimonial-card">
                  <div className="testimonial-image">
                    <img src={testimonial.imageUrl} alt={testimonial.name} />
                  </div>
                  <div className="testimonial-stars">
                    {[...Array(5)].map((_, index) => (
                      <span 
                        key={index} 
                        className={index < testimonial.stars ? 'star filled' : 'star'}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="testimonial-text">"{testimonial.testimonial}"</p>
                  <h4 className="testimonial-name">{testimonial.name}</h4>
                </div>
              ))}
            </div>
            
            <button 
              className="carousel-nav next" 
              onClick={() => scrollCarousel('right')}
              aria-label="Next testimonials"
            >
              ›
            </button>
          </div>
        )}
      </section>
      
      <Footer />
    </div>
  );
}

export default Home;