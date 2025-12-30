import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Company Info Section */}
        <div className="footer-section footer-about">
          <h3 className="footer-logo">Holistic Concierge Nursing Professionals</h3>
          <p className="footer-tagline">Compassionate Care, Delivered with Excellence</p>
          <p className="footer-description">
            Providing personalized, professional nursing services with over 25 years of
            experience in coordinated healthcare management.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/" onClick={scrollToTop}>Home</Link></li>
            <li><Link to="/about" onClick={scrollToTop}>About Us</Link></li>
            <li><Link to="/services" onClick={scrollToTop}>Services</Link></li>
            <li><Link to="/resources" onClick={scrollToTop}>Resource Page</Link></li>
            <li><Link to="/contact" onClick={scrollToTop}>Contact Us</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-section footer-services">
          <h4>Our Services</h4>
          <ul>
            <li><Link to="/services#end-of-life" onClick={scrollToTop}>Hope & Healing Program</Link></li>
            <li><Link to="/services#health-prevention" onClick={scrollToTop}>Health Prevention</Link></li>
            <li><Link to="/services#vitale-care" onClick={scrollToTop}>⁠Journey of Aging</Link></li>
            <li><Link to="/services#vitale-care" onClick={scrollToTop}>RPM - Remote Patient Monitoring</Link></li>
            <li><Link to="/services#dementia-care" onClick={scrollToTop}>Dementia Care</Link></li>
            <li><Link to="/services#dementia-care" onClick={scrollToTop}>Medical Travel Nurse Coordination</Link></li>
            <li><Link to="/services#dementia-care" onClick={scrollToTop}>End of Life Roadmapping</Link></li>
            <li><Link to="/services#dementia-care" onClick={scrollToTop}>Nurse Coaching</Link></li>
            
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section footer-contact">
          <h4>Contact Us</h4>
          <ul className="contact-info">
            <li>
              <span className="contact-icon">📞</span>
              <a href="tel:+15615951617">+1 (561) 595-1617</a>
            </li>
            <li>
              <span className="contact-icon">✉</span>
              <a href="mailto:cheryl@nursetoday.info">cheryl@nursetoday.info</a>
            </li>
            <li>
              <span className="contact-icon">📍</span>
              <span>Boca Raton</span>
            </li>
          </ul>
          <div className="footer-cta">
            <Link to="/contact" className="footer-button" onClick={scrollToTop}>Request a Consultation</Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Holistic Concierge Nursing Professionals. Developed and designed by Apollo Creations.
          </p>
          <div className="footer-legal">
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;