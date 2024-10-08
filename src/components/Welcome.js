import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <button className='btn btn-secondary btn-lg mx-3' style={{ backgroundColor:'#666666 '}} onClick={handleNavigate}> Mis Solicitudes</button>
    </div>


</div>
</div>
);

}

export default Welcome;

