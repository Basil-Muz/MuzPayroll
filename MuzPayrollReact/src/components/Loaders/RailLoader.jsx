import "./css/loading.css"

const RailLoader = ({ message = "Processing…" }) => {
  return (
    <div className="loader-overlay">
      <div className="rail-wrapper">
        <div className="rail">
          <span />
        </div>
        <p className="rail-text">{message}</p>
      </div>
    </div>
  );
};

export default RailLoader;
