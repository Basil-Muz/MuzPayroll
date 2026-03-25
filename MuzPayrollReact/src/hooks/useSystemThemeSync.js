import { useEffect } from "react";

export const useSystemThemeSync = () => {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      const manual = localStorage.getItem("theme-manual");

      // ✅ Only update if user hasn't overridden
      if (manual !== "true") {
        const newTheme = e.matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
      }
    };

    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, []);
};

export default useSystemThemeSync;