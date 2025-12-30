import React, { useState, useEffect } from 'react';
import "../styles/Home.css";
import Footer from './Footer';


const backgroundVideo = `${process.env.PUBLIC_URL}/video1.mov`;

const aboutContent = [
  { 
    title: "About Cheryl A. Ruthman, MSN, RN", 
    text: `With over 25 years of nursing experience, Cheryl founded Holistic Concierge Nursing Associates to bring compassionate, personalized care to families in Lancaster, Delray Beach, and West Palm Beach with nationwide support available in nearly all 50 states.

After serving in world-class hospitals, she recognized how seniors, veterans, and women often struggle with fragmented healthcare systems.

Our concierge nursing team provides whole-person care, from post-surgical recovery and dementia support to wellness services with advanced patient monitoring.

We make healthcare more coordinated and human, so families can focus on what matters most: each other.`
  },
  { 
    title: "Our Promise", 
    text: "At Holistic Concierge Nursing Associates, we lead with empathy, serve with excellence, and earn your trust through every interaction. You don't have to navigate healthcare alone."
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
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    fetchServices();
    fetchTestimonials();
    fetchHomeVideo();

    // Handle window resize for responsive testimonials
    const handleResize = () => {
      const wasMobile = isMobile;
      const nowMobile = window.innerWidth <= 768;
      setIsMobile(nowMobile);
      
      // Reset to first page if switching between mobile/desktop
      if (wasMobile !== nowMobile) {
        setCurrentPage(0);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

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

  // Pagination logic for testimonials - 2 on desktop, 1 on mobile
  const testimonialsPerPage = isMobile ? 1 : 2;
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);
  
  const getCurrentTestimonials = () => {
    const startIndex = currentPage * testimonialsPerPage;
    const endIndex = startIndex + testimonialsPerPage;
    return testimonials.slice(startIndex, endIndex);
  };

  const handlePrevPage = () => {
    if (isTransitioning) return; // Prevent multiple clicks during transition
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
      setIsTransitioning(false);
    }, 300); // Half of the CSS transition time
  };

  const handleNextPage = () => {
    if (isTransitioning) return; // Prevent multiple clicks during transition
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
      setIsTransitioning(false);
    }, 300); // Half of the CSS transition time
  };

  return (
    <div className="home-body">
      {/* HERO SECTION */}
     <section className="hero-section">
 <div className="license-badge">
  <a 
    href="https://www.pals.pa.gov/#!/page/search" 
    target="_blank" 
    rel="noopener noreferrer"
    style={{ textDecoration: 'none', color: 'inherit' }}
  >
    <span>Multi State Licensure: RN558107</span>
  </a>
</div>
  <video className="hero-video" autoPlay loop muted playsInline>
    <source src={backgroundVideo} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  <div className="hero-overlay"></div>
  <div className="hero-content">
    <h1>Holistic Concierge Nursing</h1>
    <p>Associates</p>
  </div>
</section>

      {/* ABOUT US SECTION */}
      <section className="about-section">
         <div className="license-badge2">
  <a 
    href="https://www.pals.pa.gov/#!/page/search" 
    target="_blank" 
    rel="noopener noreferrer"
    style={{ textDecoration: 'none', color: 'inherit' }}
  >
    <span>Multi State Licensure: RN558107</span>
  </a>
</div>
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
          <a href="tel:+17176867193" className="cta-button" style={{ textDecoration: 'none' }}>
            Request a Confidential Call
          </a>
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
                {service.iconUrl && (
                  <div className="service-icon">
                    <img src={service.iconUrl} alt={service.title} />
                  </div>
                )}
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        )}
        
        {/* Compliance Note */}
        <div className="services-compliance-note">
          <p>
            We use HIPAA-compliant remote monitoring equipment, including FDA-approved 
            devices such as the FreeStyle Libre 3 continuous glucose monitor and 
            telehealth-enabled vital sign tracking tools.
          </p>
        </div>
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

     

      {/* TESTIMONIALS SECTION - 2 on Desktop, 1 on Mobile */}
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
              onClick={handlePrevPage}
              aria-label="Previous testimonials"
              disabled={isTransitioning}
            >
              ‹
            </button>

            <div className={`carousel-wrapper ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
              {getCurrentTestimonials().map((testimonial) => (
                <div key={testimonial._id} className="testimonial-card">
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
              onClick={handleNextPage}
              aria-label="Next testimonials"
              disabled={isTransitioning}
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