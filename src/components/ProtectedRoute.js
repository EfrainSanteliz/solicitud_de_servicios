import { Navigate } from "react-router-dom";
import { useAuth } from "./UseAuth";

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, userRole, loading } = useAuth();

   
  
  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (requiredRole !== undefined && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;

}

export default ProtectedRoute;


