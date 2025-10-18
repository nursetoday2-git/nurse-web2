import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';



function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    // Scroll to top when closing sidebar
    window.scrollTo(0, 0);
  };

  // Function for scrolling to top (for desktop nav)
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <header className="header-body">
        <div className="header-container">
          <div className="logo">
            <span className="logo-text">Call A Nurse Today</span>
          </div>
          <nav className="desktop-nav">
            <Link to="/" onClick={scrollToTop}>Home</Link>
            <Link to="/about" onClick={scrollToTop}>About Us</Link>
            <Link to="/services" onClick={scrollToTop}>Services</Link>
            <Link to="/testimonials" onClick={scrollToTop}>Resource Page</Link>
            <Link to="/contact" onClick={scrollToTop}>Contact Us</Link>
          </nav>
          <button className="hamburger" onClick={toggleSidebar} aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={closeSidebar} aria-label="Close menu">
          ×
        </button>
        <nav className="sidebar-nav">
            <Link to="/" onClick={scrollToTop}>Home</Link>
            <Link to="/about" onClick={scrollToTop}>About Us</Link>
            <Link to="/services" onClick={scrollToTop}>Services</Link>
            <Link to="/testimonials" onClick={scrollToTop}>Resource Page</Link>
            <Link to="/contact" onClick={scrollToTop}>Contact Us</Link>
        </nav>
      </div>

      {/* Overlay */}
      {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </>
  );
}

export default Header;