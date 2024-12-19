import {createContext,useState } from "react";

export const UserContext = createContext();
 

export const UserProvider = ({children}) => {
    const [userRole,setUserRole] = useState(null);
    const [empleadoID,setUserid ] = useState(null);
    const [nomEmpNombre,setNomEmpNombre ] = useState(null);
    const [nomEmpPaterno,setNomEmpPaterno ] = useState(null);
    const [nomEmpMaterno,setNomEmpMaterno ] = useState(null);
    const [email,setEmail ] = useState(null);
    const [fullName,setFullName] = useState(null);
    const [direccionesDescripcion,setDireccionesDescripcion] = useState(null);
    const [token, setToken] = useState(null);


    const setUserRoleFromServer = (role,empleadoID,nomEmpNombre,nomEmpPaterno,nomEmpMaterno,email,direccionesDescripcion,token) => {
        setUserRole(role);
        setUserid(empleadoID);
        setNomEmpNombre(nomEmpNombre);
        setNomEmpPaterno(nomEmpPaterno);
        setNomEmpMaterno(nomEmpMaterno);
        setEmail(email);
        setFullName(nomEmpNombre+" "+nomEmpPaterno+" "+nomEmpMaterno);
        setDireccionesDescripcion(direccionesDescripcion);
        setToken(token);
    };

    const setRemoveToke = () => {

      setToken(null);

    };


  return (
   <UserContext.Provider value={{userRole,empleadoID,nomEmpNombre,nomEmpPaterno,nomEmpMaterno,email,fullName,direccionesDescripcion,token,setUserRoleFromServer,setRemoveToke}}>
    {children}
   </UserContext.Provider>

  );
};