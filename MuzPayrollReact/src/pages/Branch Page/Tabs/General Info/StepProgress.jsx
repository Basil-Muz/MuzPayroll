export default function StepProgress({ steps, currentStep }) {
  const progressPercent =
    (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="step-progress-wrapper">
      {/* Labels */}
      <div className="step-labels">
        {steps.map((label, index) => (
          <div
            key={label}
            className={`step-label ${
              index <= currentStep ? "active" : ""
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Line container */}
      <div className="progress-line-wrapper">
        <div className="progress-line">
          <div
            className="progress-line-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
