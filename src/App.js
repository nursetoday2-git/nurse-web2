import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './components/Admin';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import ServicePage from './components/ServicePage';
import ResourcePage from './components/ResourcePage';
import BlogPage from './components/BlogPage';
import Blog from './components/Blog'; // Add this import

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/service/:id" element={<ServicePage />} />
          <Route path="/resources" element={<ResourcePage />} />
          <Route path="/blog" element={<Blog />} /> {/* Add this route */}
          <Route path="/blog/:id" element={<BlogPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;