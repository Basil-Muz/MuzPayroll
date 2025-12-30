import { useEffect, useState } from "react";

function useIsTab(breakpoint = 1024) {
  const [isTab, setIsTab] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= breakpoint;
  });

  useEffect(() => {
    const onResize = () => {
      setIsTab(window.innerWidth <= breakpoint);
    };

    window.addEventListener("resize", onResize);
    onResize(); // ensure correct value on mount

    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isTab;
}

export default useIsTab;
