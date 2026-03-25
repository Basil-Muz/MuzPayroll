import React, { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import "./ThemeToggle.css";

const ThemeToggle = () => {
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    const manual = localStorage.getItem("theme-manual");

    if (manual === "true" && savedTheme) return savedTheme;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [rotate, setRotate] = useState(false);

  // ✅ Apply theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // // ✅ Listen to system changes (ONLY if user hasn't manually set)
  // useEffect(() => {
  //   const media = window.matchMedia("(prefers-color-scheme: dark)");

  //   const handleChange = (e) => {
  //     const manual = localStorage.getItem("theme-manual");

  //     if (manual !== "true") {
  //       setTheme(e.matches ? "dark" : "light");
  //     }
  //   };

  //   media.addEventListener("change", handleChange);

  //   return () => media.removeEventListener("change", handleChange);
  // }, []);

  // ✅ Toggle (this locks manual preference)
  const toggleTheme = () => {
    setRotate(true);

    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";

      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      localStorage.setItem("theme-manual", "true");

      return newTheme;
    });

    setTimeout(() => setRotate(false), 300);
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      <div className={`toggle-icon ${rotate ? "rotate" : ""}`}>
        {theme === "light" ? <FiMoon size={21} /> : <FiSun size={21} />}
      </div>
    </button>
  );
};

export default ThemeToggle;
