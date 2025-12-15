import React, { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import "./ThemeToggle.css";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );

  const [rotate, setRotate] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setRotate(true);
    setTheme(prev => (prev === "light" ? "dark" : "light"));

    // stop animation after rotation finishes (300ms)
    setTimeout(() => setRotate(false), 300);
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      <div className={`toggle-icon ${rotate ? "rotate" : ""}`}>
        {theme === "light" ? <FiMoon size={21} /> : <FiSun size={21} />}
      </div>

      {/* <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span> */}
    </button>
  );
};

export default ThemeToggle;
