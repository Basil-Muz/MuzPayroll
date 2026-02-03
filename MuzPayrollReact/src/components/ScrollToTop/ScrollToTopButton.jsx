import React, { useEffect, useState, useCallback } from "react";
import { IoIosArrowUp } from "react-icons/io";
import "./ScrollToTopButton.css";

const ScrollToTopButton = ({ showAfter = 100 }) => {
  const [visible, setVisible] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;

    setVisible(scrollTop > showAfter);
  }, [showAfter]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    document.documentElement.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    document.body.scrollTo({
      top: 0,
      behavior: "smooth",
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
      <IoIosArrowUp size={26} />
    </button>
  );
};

export default ScrollToTopButton;
