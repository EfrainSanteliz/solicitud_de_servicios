 [HttpPost("create")]
 public async Task<ActionResult<NomEmpleados>> PostUser(CreateUser createUser)
 {
     // Create a new instance of NomEmpleados with all necessary fields
     
     
      var NomEmpleados = new NomEmpleados
     {
         NomEmpClave = createUser.NomEmpClave,
             NomEmpNombre = createUser.NomEmpNombre,
             NomEmpPaterno = createUser.NomEmpPaterno,
             NomEmpMaterno = createUser.NomEmpMaterno,
             NomEmpSexo = createUser.NomEmpSexo,
             NomEmpEdoCivil = createUser.NomEmpEdoCivil,
             NomEmpTieneHijos = createUser.NomEmpTieneHijos,
             NomEmpFechaNacimiento = createUser.NomEmpFechaNacimiento,
             NomEmpRFC = createUser.NomEmpRFC,
             NomEmpCURP = createUser.NomEmpCURP,
             NomEmpDatosDireccionID = createUser.NomEmpDatosDireccionID,
             NomEmpTipoNomina = createUser.NomEmpTipoNomina,
             NomEmpFechaIngreso = createUser.NomEmpFechaIngreso,
             NomEmpFechaTerminacion = createUser.NomEmpFechaTerminacion,
             NomEmpAdscripcionID = createUser.NomEmpAdscripcionID,
             NomEmpPuestoID = createUser.NomEmpPuestoID,
             NomEmpTabuladorID = createUser.NomEmpTabuladorID,
             NomEmpTabuladorSubNivelClave = createUser.NomEmpTabuladorSubNivelClave,
             NomEmpNivelEstudioID = createUser.NomEmpNivelEstudioID,
             NomEmpFechaAltaIsssteson = createUser.NomEmpFechaAltaIsssteson,
             NomEmpNumeroPension = createUser.NomEmpNumeroPension,
             NomEmpNoCuentaBancaria = createUser.NomEmpNoCuentaBancaria,
             NomEmpFoto = createUser.NomEmpFoto,
             SucursalId = createUser.SucursalId,
             Carrera = createUser.Carrera,
             TipoSangre = createUser.TipoSangre,
             NumLicenciaConducir = createUser.NumLicenciaConducir,
             FechaVencimLicencia = createUser.FechaVencimLicencia,
             DeclaracionPatrimonial = createUser.DeclaracionPatrimonial,
             Antiguedad = createUser.Antiguedad,
             ClaveSindical = createUser.ClaveSindical,
             BancoId = createUser.BancoId,
             NumEmpCuentaClave = createUser.NumEmpCuentaClave,
             NomEmpEstatus = createUser.NomEmpEstatus,
             UserID = createUser.UserID,
             DepartamentoID = createUser.DepartamentoID,
             RecursoID = createUser.RecursoID,
             NomEmpGradoDominio = createUser.NomEmpGradoDominio,
             NomEmpTipoAnalisis = createUser.NomEmpTipoAnalisis,
             NomEmpMarco = createUser.NomEmpMarco,
             EstaActivo = createUser.EstaActivo,
             EnviarCorreoFalta = createUser.EnviarCorreoFalta,
             NomEmpClaveRHGE = createUser.NomEmpClaveRHGE,
             AfiliacionIsssteson = createUser.AfiliacionIsssteson,
             CatPuestoID = createUser.CatPuestoID,
             NomEmpIngresoGobEdo = createUser.NomEmpIngresoGobEdo,
             NSS = createUser.NSS,
             NumeroFonacot = createUser.NumeroFonacot,
             NomEmpClaveAntesRHGE = createUser.NomEmpClaveAntesRHGE,
             RequiereLicencia = createUser.RequiereLicencia,
             ActividadPresupuestal = createUser.ActividadPresupuestal,




            Usuarios = new Usuarios
         {
               Email = createUser.Email,
  Password = createUser.Password,
  UserRole = createUser.UserRole,
  EmpleadoID = createUser.EmpleadoID,



         }

         
     };

     // Add the new user to the context
     _userContext.Usuarios.Add(Usuarios);
     await _userContext.SaveChangesAsync();


     // Return the created user with associated requests
     return CreatedAtAction(nameof(GetUser), new { id = Usuarios.UsuarioId }, Usuarios);
 }