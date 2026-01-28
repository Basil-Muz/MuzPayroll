export const ensureMinDuration = async (startTime, minDuration = 700) => {
  const elapsed = Date.now() - startTime;//Measure elapsed time (loader started)
  const remaining = minDuration - elapsed;//Calculate remaining time

  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining));
  }
};
