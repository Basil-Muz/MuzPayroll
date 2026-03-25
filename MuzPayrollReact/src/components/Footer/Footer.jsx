// Footer.jsx
import React, { useState, useEffect } from "react";
import "./Footer.css";

const Footer = () => {
  // added state for small-screen toggle
  const [linksOpen, setLinksOpen] = useState(false);

  // close the mobile links when resizing to larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 480 && linksOpen) setLinksOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [linksOpen]);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-left">
        <span className="copyright-symbol">©</span>
        <span className="copyright-text">{currentYear} Muz PayRoll</span>
        <span className="version-badge">v0.0.1</span>
      </div>

      {/* <div className="footer-center">
        <div className="system-status">
          <span className="status-dot status-online"></span>
          <span className="status-text">System Online</span>
        </div>
      </div> */}

      <div className="footer-right">
        {/* Toggle button visible on small screens */}
        <button
          className="footer-toggle"
          aria-expanded={linksOpen}
          aria-controls="footer-links"
          onClick={() => setLinksOpen((v) => !v)}
        >
          <span className="sr-only">Toggle footer links</span>
          <span className={`hamburger ${linksOpen ? "open" : ""}`} />
        </button>

        {/* collapsible links: id used by aria-controls */}
        <nav
          id="footer-links"
          className={`footer-links ${linksOpen ? "open" : ""}`}
        >
          <a href="#privacy" className="footer-link">
            Privacy
          </a>
          <span className="link-separator">•</span>
          <a href="#terms" className="footer-link">
            Terms
          </a>
          <span className="link-separator">•</span>
          <a href="#support" className="footer-link">
            Support
          </a>
        </nav>

        {/* Alert icon - shown conditionally */}
        {/* <div className="footer-alert-wrapper">
          <span className="footer-alert-icon" title="3 notifications">3</span>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
