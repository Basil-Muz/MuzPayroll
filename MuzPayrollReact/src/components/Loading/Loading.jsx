// LoadingPage.jsx
import React from 'react';
import './loading.css'; // Make sure to import the CSS

const LoadingPage = () => {
  return (
    <div className="loading-container">
      {/* <div className="spinner" /> */}
      <div className="loading-text">Processing...</div>
    </div>
  );
};

export default LoadingPage;
