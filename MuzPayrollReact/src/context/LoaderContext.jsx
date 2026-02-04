import React, { createContext, useContext, useState } from "react";

const LoaderContext = createContext();

const MAX_RETRY = 2;

export const LoaderProvider = ({ children }) => {
  const [loader, setLoader] = useState({
    type: null,
    title: "",
    steps: [],
    activeStep: 0,
    error: null,
    retryCount: 0,
  });

  const showStepLoader = ({ title, steps }) => {
    setLoader({
      type: "step",
      title,
      steps,
      activeStep: 0,
      error: null,
      retryCount: 0,
    });
  };

  const updateStep = (stepIndex) => {
    setLoader((prev) => ({ ...prev, activeStep: stepIndex }));
  };

  const failStep = (error) => {
    setLoader((prev) => ({ ...prev, error }));
  };

  const retryStep = () => {
    setLoader((prev) => {
      if (prev.retryCount >= MAX_RETRY) return prev;
      return {
        ...prev,
        error: null,
        retryCount: prev.retryCount + 1,
      };
    });
  };

  const showRailLoader = (message) => {
    setLoader({
      type: "rail",
      message,
    });
  };

  const hideLoader = () => setLoader({ type: null });

  return (
    <LoaderContext.Provider
      value={{
        loader,
        showStepLoader,
        updateStep,
        failStep,
        showRailLoader,
        retryStep,
        hideLoader,
        MAX_RETRY,
      }}
    >
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
