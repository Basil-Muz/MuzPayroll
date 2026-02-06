import { useLayoutEffect, useState } from "react";

export function useSmartOverlay(triggerRef, open, options = {}) {
  const {
    offset = 4,
    maxHeight = 290,
  } = options;

  const [style, setStyle] = useState(null);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    const openUpward = spaceBelow < maxHeight && spaceAbove > spaceBelow;

    setStyle({
      position: "absolute",
      minWidth: rect.width,
      left: rect.left + window.scrollX,
      top: openUpward
        ? rect.top + window.scrollY - maxHeight + offset
        : rect.bottom + window.scrollY + offset,
      maxHeight,
      zIndex: 9999,
    });
  }, [open, triggerRef, offset, maxHeight]);

  return style;
}
