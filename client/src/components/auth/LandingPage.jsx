import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">
          Travel Smarter, Not Harder.
        </h1>
        <p className="landing-subtitle">
          Stay ahead of travel risks with real-time alerts and comprehensive monitoring. Your safety is our priority.
        </p>
        <div className="landing-actions">
          <Link to="/register" className="btn btn-primary btn-large">Get Started for Free</Link>
          <Link to="/login" className="btn btn-secondary btn-large">Sign In</Link>
        </div>
      </div>
      <div className="landing-image-container">
        {/* You can place an illustration or image here */}
        <img src="https://placehold.co/600x400/e0e7ff/4338ca?text=TravelRisk+Monitor" alt="Travel Risk Monitor Illustration" />
      </div>
    </div>
  );
};

export default LandingPage;