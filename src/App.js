import logo from "./logo.svg";
import "./App.css";
import Welcome from "./components/Welcome";
import NewRequest from "./components/NewRequest";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import "bootstrap/dist/css/bootstrap.min.css";
import MisSolicitudes from "./components/MisSolicitudes";
import NuevaSolicitud from "./components/NuevaSolicitud";
import NewUser from "./components/NewUser";
import WelcomeSuperAdministrador from "./components/WelcomeSuperAdministrador";
import WelcomeAdministrador from "./components/WelcomeAdministrador";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar2 from "./components/Navbar2";
import ProtectedRoute from "./components/ProtectedRoute";
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome CSS

function App() {
  return (
    <> 
      <Router>
        <Navbar2 />
        <ToastContainer />

        <Routes>
            <Route path="/Welcome" element={<ProtectedRoute><Welcome/></ProtectedRoute>} />
            <Route path="/MisSolicitudes" element={<ProtectedRoute><MisSolicitudes /></ProtectedRoute>} />
            <Route path="/NuevaSolicitud" element={<ProtectedRoute><NuevaSolicitud /></ProtectedRoute>} />
            <Route path="/NewUser" element={<NewUser />} />
            <Route
              path="/WelcomeAdministrador"
              element={<ProtectedRoute><WelcomeAdministrador /></ProtectedRoute>}
            />
            <Route
              path="/WelcomeSuperAdministrador"
              element={<ProtectedRoute><WelcomeSuperAdministrador /></ProtectedRoute>}
            />

            <Route path="/" element={<Login />} />
          
        </Routes>
      </Router>
    </>
  );
}

export default App;
