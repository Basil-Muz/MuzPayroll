import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all localStorage data
    localStorage.clear();

    // Optional: clear sessionStorage also
    sessionStorage.clear();

    // Redirect to login page
    navigate("/", { replace: true });
  }, [navigate]);

  return null; // nothing to render
}

export default Logout;
