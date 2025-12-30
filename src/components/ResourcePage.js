import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ResourcePage.css";
import Footer from "./Footer";

function ResourcePage() {
  const API_BASE_URL = "https://nurse-back.onrender.com";
  const navigate = useNavigate();
  const [pdfs, setPdfs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Show more/less states
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);
  const [showAllPdfs, setShowAllPdfs] = useState(false);

  // Refs for scrolling to sections
  const pdfSectionRef = useRef(null);
  const testimonialSectionRef = useRef(null);

  // Define initial counts
  const INITIAL_TESTIMONIALS_COUNT = 10;
  const INITIAL_PDFS_COUNT = 4;

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);

        const [pdfRes, testimonialRes] = await Promise.all([
          fetch(`${API_BASE_URL}/pdf`),
          fetch(`${API_BASE_URL}/testimonials`)
        ]);

        if (!pdfRes.ok || !testimonialRes.ok) {
          throw new Error("Failed to load some resources.");
        }

        const pdfData = await pdfRes.json();
        const testimonialData = await testimonialRes.json();

        setPdfs(pdfData.pdfs || []);
        setTestimonials(testimonialData.testimonials || []);

      } catch (err) {
        console.error("Error loading resources:", err);
        setError(`Failed to load resources: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [API_BASE_URL]);

  // Toggle functions with scroll
  const togglePdfs = () => {
    if (showAllPdfs && pdfSectionRef.current) {
      pdfSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setShowAllPdfs(!showAllPdfs);
  };

  const toggleTestimonials = () => {
    if (showAllTestimonials && testimonialSectionRef.current) {
      testimonialSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setShowAllTestimonials(!showAllTestimonials);
  };

  // Determine which subset of resources to display
  const displayedTestimonials = showAllTestimonials ? testimonials : testimonials.slice(0, INITIAL_TESTIMONIALS_COUNT);
  const displayedPdfs = showAllPdfs ? pdfs : pdfs.slice(0, INITIAL_PDFS_COUNT);

  if (loading) {
    return (
      <div className="resource-container">
        <p>Loading resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resource-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="resource-container">
      {/* HEADER SECTION - NEW */}
      <header className="resource-header">
        <h1>Resources</h1>
        <h2>Educational Materials & Client Testimonials</h2>
        <div className="resource-header-buttons">
          <button onClick={() => navigate('/contact')}>Contact Now</button>
          <a href="https://docs.google.com/forms/d/1xU2q8VmYtgmlWc7C89t4gOZ4odlqHvoF9Jvyf3eO974/viewform?pli=1&pli=1&edit_requested=true" target="_blank" rel="noopener noreferrer">
            <button>Request a Consultation</button>
          </a>
        </div>
      </header>

      {/* Downloadable PDFs Section */}
      {pdfs.length > 0 && (
        <section className="resource-section" ref={pdfSectionRef}>
          <h2>📄 Downloadable Documents</h2>
          <div className="resource-grid">
            {displayedPdfs.map((pdf) => (
              <div key={pdf._id} className="pdf-card resource-card">
                <div className="pdf-icon">📑</div>
                <h3>{pdf.title}</h3>
                {pdf.description && <p>{pdf.description}</p>}

                {pdf.pdfUrl && (
                  <div className="pdf-actions single-action">
                    <a
                      href={pdf.pdfUrl}
                      download={pdf.title || 'document.pdf'}
                      className="pdf-link download-link full-width"
                    >
                      <span>⬇️</span> Download Document
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* PDF SHOW MORE/LESS BUTTON */}
          {pdfs.length > INITIAL_PDFS_COUNT && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                className="show-more-btn"
                onClick={togglePdfs}
              >
                {showAllPdfs
                  ? '▲ Show Less Documents'
                  : `▼ Show More Documents (${pdfs.length - INITIAL_PDFS_COUNT} more)`
                }
              </button>
            </div>
          )}
        </section>
      )}

      {/* Educational Products Section - Etsy */}
      <section className="resource-section educational-section">
        <h2>📚 Educational Products</h2>
        <div className="etsy-card">
          <div className="etsy-content">
            <div className="etsy-icon">
              🎓
            </div>
            <div className="etsy-text">
              <h3>Nursing Boards Training Flashcards</h3>
              <p>Comprehensive study materials designed to help nursing students excel in their board examinations. High-quality flashcards covering essential topics and concepts.</p>
            </div>
          </div>
          <div className="etsy-actions">
            <a 
              href="https://www.etsy.com/shop/holisticnursing?ref=seller-platform-mcnav" 
              target="_blank" 
              rel="noopener noreferrer"
              className="etsy-link"
            >
              <span></span> Shop on Etsy
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="resource-section" ref={testimonialSectionRef}>
          <h2>💬 Testimonials</h2>
          <div className="resource-grid">
            {displayedTestimonials.map((t) => (
              <div key={t._id} className="resource-card testimonial-card2">
                {t.imageUrl && (
                  <img
                    src={t.imageUrl}
                    alt={t.name}
                    className="testimonial-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <blockquote>{t.testimonial}</blockquote>
                <p>— {t.name}</p>
                {t.stars && <p>⭐ {t.stars} / 5</p>}
              </div>
            ))}
          </div>
          {/* TESTIMONIALS SHOW MORE/LESS BUTTON */}
          {testimonials.length > INITIAL_TESTIMONIALS_COUNT && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button className="show-more-btn"
                onClick={toggleTestimonials}
              >
                {showAllTestimonials
                  ? '▲ Show Less Testimonials'
                  : `▼ Show More Testimonials (${testimonials.length - INITIAL_TESTIMONIALS_COUNT} more)`
                }
              </button>
            </div>
          )}
        </section>
      )}

      <Footer />
    </div>
  );
}

export default ResourcePage;