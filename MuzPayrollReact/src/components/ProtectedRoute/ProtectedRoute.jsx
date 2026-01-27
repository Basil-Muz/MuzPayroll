import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const storedData = localStorage.getItem("loginData");

  if (!storedData) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(storedData);

  if (!user.token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
