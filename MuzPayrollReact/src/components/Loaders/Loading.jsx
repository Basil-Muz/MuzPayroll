import React from "react";
import "./css/loading.css"

const LoadingPage = () => {
  return (
    <div className="loading-overlay">
      <div className="rail-loader">
        <span />
      </div>
      <div className="loading-text">Processing…</div>
    </div>
  );
};

export default LoadingPage;
