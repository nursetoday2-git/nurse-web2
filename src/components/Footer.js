import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Company Info Section */}
        <div className="footer-section footer-about">
          <h3 className="footer-logo">Holistic Concierge Nursing Professionals</h3>
          <p className="footer-tagline">Compassionate Care, Delivered with Excellence</p>
          <p className="footer-description">
            Providing personalized, professional nursing services with over 20 years of 
            experience in coordinated healthcare management.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/resources">Resource Page</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-section footer-services">
          <h4>Our Services</h4>
          <ul>
            <li><a href="/services#end-of-life">End of Life Roadmapping</a></li>
            <li><a href="/services#health-prevention">Health Prevention</a></li>
            <li><a href="/services#vitale-care">Vitale Care - RPM</a></li>
            <li><a href="/services#dementia-care">Dementia Care</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section footer-contact">
          <h4>Contact Us</h4>
          <ul className="contact-info">
            <li>
              <span className="contact-icon">📞</span>
              <a href="tel:+1234567890">(123) 456-7890</a>
            </li>
            <li>
              <span className="contact-icon">✉</span>
              <a href="mailto:info@hcnprofessionals.com">info@hcnprofessionals.com</a>
            </li>
            <li>
              <span className="contact-icon">📍</span>
              <span>Serving [Your Service Area]</span>
            </li>
          </ul>
          <div className="footer-cta">
            <a href="/contact" className="footer-button">Request a Consultation</a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Holistic Concierge Nursing Professionals. All rights reserved.
          </p>
          <div className="footer-legal">
            <a href="/privacy-policy">Privacy Policy</a>
            <span className="separator">|</span>
            <a href="/terms-of-service">Terms of Service</a>
            <span className="separator">|</span>
            <a href="/hipaa-compliance">HIPAA Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;