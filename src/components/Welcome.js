import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MisSolicitudes from "./MisSolicitudes";

function Welcome () {

    const navigate = useNavigate();

    const handleNavigate = () => {
    navigate("/MisSolicitudes");
    }

    const handleNavigate2 = () => {
        navigate ("/NuevaSolicitud");
    }

    


return (
    <div>
<div className='container mt-5'>
    <h1 className='text-center'>Solicitud De Servicios</h1>    
   
    <div className= 'd-flex justify-content-center mt-5'>
        
        
        <button className='btn btn-primary btn-lg mx-3' style={{ backgroundColor:'#237469 '}} onClick={handleNavigate2}> Nueva Solicitud </button>
        

    </div>
    <MisSolicitudes></MisSolicitudes>



</div>
</div>
);

}

export default Welcome;

