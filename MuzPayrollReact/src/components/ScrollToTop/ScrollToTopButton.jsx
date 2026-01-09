import React, { useEffect, useState, useCallback } from "react";
import { FaArrowUp } from "react-icons/fa";
import "./ScrollToTopButton.css";

const ScrollToTopButton = ({ showAfter = 300 }) => {
  const [visible, setVisible] = useState(false);

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > showAfter);
  }, [showAfter]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: "smooth" 
    });
  };

  return (
    <button
      className={`to-top-btn ${visible ? "show" : ""}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      tabIndex={visible ? 0 : -1}
    >
      <FaArrowUp size={20} aria-hidden="true" />
    </button>
  );
};

export default ScrollToTopButton;