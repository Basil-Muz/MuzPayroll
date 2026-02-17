import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ optionId, children }) => {
  const { menus, isMenuLoaded } = useAuth();

  if (!isMenuLoaded) return null;

  const allowed = menus?.raw?.some(
    m => m.id === optionId
  );

  if (!allowed) return <Navigate to="/unauthorized" replace />;

  return children;
};



export default ProtectedRoute;
