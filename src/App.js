import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './components/Admin';
import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;