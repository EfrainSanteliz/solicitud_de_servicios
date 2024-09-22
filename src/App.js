import logo from './logo.svg';
import './App.css';
import Welcome from './components/Welcome';
import NewRequest from './components/NewRequest';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import 'bootstrap/dist/css/bootstrap.min.css';
import MisSolicitudes from './components/MisSolicitudes';
import NuevaSolicitud  from './components/NuevaSolicitud';
import NewUser from './components/NewUser';
import WelcomeSuperAdministrador from './components/WelcomeSuperAdministrador';
import WelcomeAdministrador from './components/WelcomeAdministrador';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/Login" element = {<Login/>}/>
      <Route path="/Welcome" element = {<Welcome/>}/>
      <Route path="/MisSolicitudes" element = {<MisSolicitudes/>} />
      <Route path='/NuevaSolicitud' element = {<NuevaSolicitud/>} />
      <Route path='/NewUser' element = {<NewUser/>} />
      <Route path='/WelcomeAdministrador' element = { <WelcomeAdministrador/> }/>
      <Route path='/WelcomeSuperAdministrador' element = { <WelcomeSuperAdministrador/> }/>



      <Route path="/" element = {<Login/>}/>

    </Routes>
    </Router>
  );
}

export default App;
