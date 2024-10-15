import React from "react";
import { Navigate} from 'react-router-dom';
import { isAuthenticated } from "./JwtHelper";

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="Login"></Navigate>
};

export default ProtectedRoute;