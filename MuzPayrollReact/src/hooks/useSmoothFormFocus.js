// hooks/useSmoothFormFocus.js
import { useCallback } from "react";

export const useSmoothFormFocus = ({
  formFlags,
  setFocus,
}) => {
   //for smooth focus
  const smoothFocus = useCallback(() => {
    const fieldName =
      formFlags.locationForm
        ? "location"
        : formFlags.companyForm
          ? "company"
          : formFlags.branchForm
            ? "branch"
            : null;

    if (!fieldName) return;

    const el = document.querySelector(`[name="${fieldName}"]`);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    setFocus(fieldName);
  }, [formFlags, setFocus]);

  return { smoothFocus };
};
