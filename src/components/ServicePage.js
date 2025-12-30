import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ServicePage.css";
import Footer from './Footer';

function ServicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "https://nurse-back.onrender.com";

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/services`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        
        // Find the specific service by ID
        const foundService = data.services.find(s => s._id === id);
        
        if (!foundService) {
          throw new Error("Service not found");
        }
        
        setService(foundService);
      } catch (err) {
        console.error("Error loading service:", err);
        setError("Failed to load service. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="service-detail-container">
        <div className="service-detail-loading">
          <p>Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="service-detail-container">
        <div className="service-detail-error">
          <p>{error || "Service not found"}</p>
          <button onClick={() => navigate('/services')} className="back-button">
            ← Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="service-detail-container">
      {/* Back Button */}
      <div className="service-detail-back">
        <button onClick={() => navigate('/services')} className="back-button">
          ← Back to Services
        </button>
      </div>

      {/* Hero Section */}
      <section className="service-detail-hero">
        <div className="service-detail-hero-content">
          <h1 className="service-detail-title">{service.title}</h1>
          <div className="service-detail-divider"></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="service-detail-main">
        <div className="service-detail-wrapper">
          {/* Image Section */}
          {service.imageUrl && (
            <div className="service-detail-image-container">
              <img
                src={service.imageUrl}
                alt={service.title}
                className="service-detail-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Description Section */}
          <div className="service-detail-content">
            <h2 className="service-detail-subtitle">About This Service</h2>
            <div className="service-detail-description">
              {service.description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="service-detail-cta">
            <h3>Interested in This Service?</h3>
            <p>Contact us today to learn more or schedule a consultation.</p>
            <div className="service-detail-cta-buttons">
              <button 
                className="cta-primary-button"
                onClick={() => navigate('/contact')}
              >
                Contact Us
              </button>
              <button 
                className="cta-secondary-button"
                onClick={() => navigate('/services')}
              >
                View All Services
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ServicePage;