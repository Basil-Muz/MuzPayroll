// Footer.jsx
import React from "react";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-left">
        <span className="copyright-symbol">©</span>
        <span className="copyright-text">
          {currentYear} Muz PayRoll
        </span>
        <span className="version-badge">v0.0.1</span>
      </div>

      {/* <div className="footer-center">
        <div className="system-status">
          <span className="status-dot status-online"></span>
          <span className="status-text">System Online</span>
        </div>
      </div> */}

      <div className="footer-right">
        <div className="footer-links">
          <a href="#privacy" className="footer-link">Privacy</a>
          <span className="link-separator">•</span>
          <a href="#terms" className="footer-link">Terms</a>
          <span className="link-separator">•</span>
          <a href="#support" className="footer-link">Support</a>
        </div>
        
        {/* Alert icon - shown conditionally */}
        {/* <div className="footer-alert-wrapper">
          <span className="footer-alert-icon" title="3 notifications">3</span>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;