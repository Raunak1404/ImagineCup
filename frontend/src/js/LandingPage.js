import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../css/LandingPage.css';  

const LandingPage = () => {
  const location = useLocation();  
  const navigate = useNavigate();  

  const { welcomeMessage = '' } = location.state || {};

  const handleStartNow = () => {
    navigate('/home');  
  };

  return (
    <p>Hii</p>
  );
};

export default LandingPage;