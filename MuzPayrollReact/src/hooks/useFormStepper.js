// hooks/useFormStepper.js
import { useCallback } from "react";

export const useFormStepper = ({ trigger, setStep }) => {
  const nextStep = useCallback(async () => {
    const valid = await trigger();
    if (valid) {
      setStep((s) => s + 1);
    }
  }, [trigger, setStep]);

  const prevStep = useCallback(() => {
    setStep((s) => s - 1);
  }, [setStep]);

  return { nextStep, prevStep };
};
