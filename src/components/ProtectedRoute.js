import { Navigate } from "react-router-dom";
import { useAuth } from "./UseAuth";
import { isAuthenticated2} from "./JwtHelper";

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

  return isAuthenticated2() ? children : <Navigate to="/"></Navigate>
}

export default ProtectedRoute;


