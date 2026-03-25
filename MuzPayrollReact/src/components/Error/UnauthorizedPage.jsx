// src/components/error/UnauthorizedPage.jsx

import { useNavigate } from "react-router-dom";
import { MdLock } from "react-icons/md";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loginData");
    navigate("/");
  };

  return (
    <div className="error-page">
      <div className="error-card">

        <div className="error-icon-circle"> <MdLock size={30} color="#e74c3c" /></div>
        <span className="badge badge-401">Unauthorized</span>
        <h1 className="error-title">Access Denied</h1>
        <p className="error-desc">
          You don't have permission to view this page.
          Please log in with the correct account or contact your administrator.
        </p>

        <div className="btn-row">
          <button className="btn btn-primary" onClick={handleLogout}>
            Go to Login
          </button>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>

        <hr className="divider" />
        <p className="support-text">
          Need access? Contact <span>your administrator</span>
        </p>

      </div>
    </div>
  );
};

export default UnauthorizedPage;