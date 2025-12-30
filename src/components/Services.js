import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Services.css";
import Footer from "./Footer";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = "https://nurse-back.onrender.com";

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/services`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setServices(data.services || []);
      } catch (err) {
        console.error("Error loading services:", err);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleLearnMore = (serviceId) => {
    window.scrollTo(0, 0);
    navigate(`/service/${serviceId}`);
  };

  if (loading) {
    return (
      <>
        <div className="service-page-container">
          <div className="service-page-loading">Loading services...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="service-page-container">
          <div className="service-page-error">{error}</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="service-page-container">
        <div className="service-page-header">
          <h1 className="service-page-title">Our Services</h1>
          <p className="service-page-subtitle">
            Comprehensive healthcare services tailored to your needs
          </p>
        </div>
        <div className="service-page-grid">
          {services.map((service) => (
            <div key={service._id} className="service-page-card">
              {service.imageUrl && (
                <div className="service-page-image-wrapper">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="service-page-image"
                    onError={(e) => {
                      console.error('Failed to load image:', service.imageUrl);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="service-page-content">
                <h3 className="service-page-card-title">{service.title}</h3>
                <p className="service-page-description">
                  {service.description.length > 150
                    ? `${service.description.substring(0, 150)}...`
                    : service.description}
                </p>
                <button
                  className="service-page-btn"
                  onClick={() => handleLearnMore(service._id)}
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
        {services.length === 0 && (
          <div className="service-page-empty">
            <p>No services available at the moment.</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Services;