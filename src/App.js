import "./App.css";
import Welcome from "./components/Welcome";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import "bootstrap/dist/css/bootstrap.min.css";
import MisSolicitudes from "./components/MisSolicitudes";
import NuevaSolicitud from "./components/NuevaSolicitud";
import WelcomeSuperAdministrador from "./components/WelcomeSuperAdministrador";
import WelcomeAdministrador from "./components/WelcomeAdministrador";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar2 from "./components/Navbar2";
import ProtectedRoute from "./components/ProtectedRoute";
import StoreUser from "./components/StoreUser";
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome CSS
import WelcomeSubAdministrador from "./components/WelcomeSubAdministrador";
function App() {
  
  return (
    <> 
      <Router>
        <Navbar2 />
        <ToastContainer />

        <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/Welcome" element={<ProtectedRoute requiredRole= {1}><Welcome/></ProtectedRoute> } />
            <Route path="/MisSolicitudes" element={<ProtectedRoute requiredRole= {1}><MisSolicitudes /></ProtectedRoute>} />
            <Route path="/NuevaSolicitud" element={<ProtectedRoute requiredRole= {1}><NuevaSolicitud /></ProtectedRoute>} />
            <Route path="/WelcomeSubAdministrador" element={<ProtectedRoute requiredRole= {3}><WelcomeSubAdministrador /></ProtectedRoute>} />

           {/* <Route path="/NewUser" element={<NewUser />} />*/}
            <Route
              path="/WelcomeAdministrador"
              element={<ProtectedRoute requiredRole= {2}><WelcomeAdministrador /></ProtectedRoute>}
            />
            <Route
              path="/WelcomeSuperAdministrador"
              element={<ProtectedRoute requiredRole= {4}><WelcomeSuperAdministrador /></ProtectedRoute>}
            />

            <Route
              path="/StoreUser"
              element={<ProtectedRoute requiredRole= {4}><StoreUser /></ProtectedRoute>}
            />

          
        </Routes>
      </Router>
    </>
  );
}

export default App;
