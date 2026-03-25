// src/components/error/NotFoundPage.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import ContactAdminModal from "./ContactAdminModal";
const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="error-page">
      <div className="error-card">
        <div className="big-code">404</div>
        <span className="badge badge-404">Page Not Found</span>
        <h1 className="error-title">Oops! Wrong path</h1>
        <p className="error-desc">
          The page you're looking for doesn't exist or has been moved. Check the
          URL or head back to the dashboard.
        </p>

        <div className="path-pill">{location.pathname}</div>

        <div className="btn-row">
          <button className="btn btn-primary" onClick={() => navigate("/home")}>
            Go to Dashboard
          </button>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>

        <hr className="divider" />
        <p className="support-text">
          Lost? Contact{" "}
          <span onClick={() => setShowModal(true)}>your administrator</span>
        </p>
      </div>
      {showModal && <ContactAdminModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default NotFoundPage;
