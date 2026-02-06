import { createPortal } from "react-dom";

export function SmartOverlay({ open, style, children }) {
  if (!open || !style) return null;

  return createPortal(
    <div style={style}>
      {children}
    </div>,
    document.body
  );
}
