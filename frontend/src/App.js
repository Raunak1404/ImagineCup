import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router components
import './App.css';
import LoginPage from './js/LoginPage'; // Import LoginPage
import LandingPage from './js/LandingPage'; // Import LandingPage

function App() {
  return (
    <Router>
      <div className="App">
        {/* Define routes for LoginPage and LandingPage */}
        <Routes>
          <Route path="/" element={<LoginPage />} /> {/* Default route (LoginPage) */}
          <Route path="/landing" element={<LandingPage />} /> {/* LandingPage route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
