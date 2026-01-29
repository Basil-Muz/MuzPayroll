import { useLoader } from "../../context/LoaderContext";
import "./css/loading.css"
const StepProcessLoader = ({
  title,
  steps,
  activeStep,
  error,
  retryCount,
}) => {
  const { retryStep, hideLoader, MAX_RETRY } = useLoader();

  return (
    <div className="loader-overlay">
      <div className="step-card">
        <h3 className="step-title">{title}</h3>

        <ul className="step-list">
          {steps.map((s, i) => (
            <li
              key={s.label}
              className={
                i < activeStep
                  ? "done"
                  : i === activeStep
                  ? "active"
                  : ""
              }
            >
              <span className="dot" />
              {s.label}
            </li>
          ))}
        </ul>

        {error ? (
          <div className="step-error">
            ⚠ {error}

            <div className="step-actions">
              <button
                onClick={retryStep}
                disabled={retryCount >= MAX_RETRY}
              >
                Retry Step
              </button>

              <button className="secondary" onClick={hideLoader}>
                Exit
              </button>
            </div>

            {retryCount >= MAX_RETRY && (
              <p className="retry-limit">
                Maximum retry attempts reached.  
                Please contact support.
              </p>
            )}
          </div>
        ) : (
          <p className="step-hint">
            Please do not refresh or close this page
          </p>
        )}
      </div>
    </div>
  );
};

export default StepProcessLoader;
