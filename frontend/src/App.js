import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import './App.css';
import LoginPage from './js/LoginPage';
import Editor from './js/Editor'; 
import SignUpPage from './js/SignUpPage';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Define routes for LoginPage and LandingPage */}
        <Routes>
          <Route path="/" element={<LoginPage />} /> {/* Default route (LoginPage) */}
          <Route path="/editor" element={<Editor />} /> {/* LandingPage route */}
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
