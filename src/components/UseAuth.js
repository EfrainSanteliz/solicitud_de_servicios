import { useState,useEffect,useContext } from "react";
import { jwtDecode } from "jwt-decode"; // Update import statement
import { UserContext } from "./UserContext";

export function useAuth() {
  const [auth, setAuth] = useState({ isAuthenticated: false, userRole: null });
  const [loading,setLoading] = useState(true);
  const {token} = useContext(UserContext);

  useEffect(() => {
    //const token = localStorage.getItem("jwtToken2");


    if (token) {
      try {
        // Extrae y decodifica la segunda parte del token JWT
        const payload = JSON.parse(atob(token.split(".")[1]));


        // Asegúrate de usar el nombre exacto de la clave (por ejemplo, `role` o `UserRole`)
        setAuth({
          isAuthenticated: true,
          userRole: parseInt(payload.role || payload.UserRole, 10),
        });
      } catch (error) {
        console.error("Token no válido:", error);
      }
    }
    setLoading(false);
  }, []);

  return {...auth, loading};
}