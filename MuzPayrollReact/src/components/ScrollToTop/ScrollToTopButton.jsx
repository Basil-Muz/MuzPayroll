import React, { useEffect, useState } from "react";
import { IoMdRocket } from "react-icons/io";
import "./ScrollToTopButton.css";

const ScrollToTopButton = ({ showAfter = 120 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > showAfter) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className={`to-top-btn ${visible ? "show" : ""}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <IoMdRocket size={23} color="#f11b1b" />
    </button>
  );
};

export default ScrollToTopButton;
