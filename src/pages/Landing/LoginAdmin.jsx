import React, { useState } from "react"; // Asegúrate de importar useState
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const LoginAdmin = () => {
  const [Usuario, setUsuario] = useState("");
  const [Contrasenia, setContrasenia] = useState("");

  const url = "http://localhost:3000/api/authWeb/loginAdmin";


  const [errors, setErrors] = useState({
    usuario: "",
    contrasenia: "",
  });

  const show_alerta = (message, type) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: message,
      icon: type,
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
      didOpen: () => {
        const progressBar = MySwal.getTimerProgressBar();
        if (progressBar) {
          progressBar.style.backgroundColor = "black";
          progressBar.style.height = "6px";
        }
      },
    });
  };

  const validateUsuario = (value) => {
    if (!value) {
      return "Escribe el usuario";
    }
    if (!/^[a-zA-Z0-9ñÑ-]+$/.test(value)) {
      return "El nombre de usuario solo puede contener letras, números y caracteres especiales, sin espacios";
    }
    if (value.length < 10 || value.length > 60) {
      return "El usuario debe tener entre 10 y 60 caracteres";
    }
    return "";
  };

  const validateContrasenia = (value) => {
    if (!value) {
      return "La contraseña es requerida";
    } else if (value.length < 8 || value.length > 15) {
      return "La contraseña debe tener entre 8 y 15 caracteres";
    }
    return "";
  };

  const handleChangeUsuario = (e) => {
    const value = e.target.value.replace(/\s+/g, ""); // Eliminar todos los espacios
    setUsuario(value);
  
    // Validar el usuario
    const errorMessage = validateUsuario(value);
    setErrors((prevState) => ({
      ...prevState,
      usuario: errorMessage,
    }));
  };

  const handleChangeContrasenia = (e) => {
    setContrasenia(e.target.value);
    const errorMessage = validateContrasenia(e.target.value);
    setErrors((prevState) => ({
      ...prevState,
      contrasenia: errorMessage,
    }));
  };

  const renderErrorMessage = (errorMessage) => {
    return errorMessage ? (
      <div className="invalid-feedback">{errorMessage}</div>
    ) : null;
  };

  const loguearUsuario = async () => {
    // e.preventDefault();
    const cleanedContrasenia = Contrasenia.trim();
    const cleanedUsuario = Usuario.trim();
    
    if (!cleanedUsuario) {
      show_alerta("El usuario es necesario", "error");
      return;
    }
    console.log(cleanedUsuario);
    if (!/^[a-zA-Z0-9ñÑ-]+$/.test(cleanedUsuario)) {
      show_alerta("El nombre de usuario solo puede contener letras, números y caracteres especiales, sin espacios", "error");
      return;
    }
    if (cleanedUsuario.length < 10 || cleanedUsuario.length > 60) {
      show_alerta("El usuario debe tener entre 10 y 60 caracteres", "error");
      return;
    }
    if (!cleanedContrasenia) {
      show_alerta("La contraseña es requerida", "error");
      return;
    }
    if (Contrasenia.length < 8 || Contrasenia.length > 15) {
      show_alerta("La contraseña debe tener entre 8 y 15 caracteres", "error");
      return;
    };

    try {
      // Lógica para guardar el cliente
      await enviarSolicitud( {
        Usuario,
        Contrasenia,
      });

      // show_alerta("Operación exitosa", "success");
    } catch (error) {
      if (error.response) {
        show_alerta(error.response.data.message, "error");
      } else if (error.request) {
        show_alerta("Error en la solicitud", "error");
      } else {
        show_alerta("Error desconocido", "error");
      }
      console.log(error);
    }
  };

  const enviarSolicitud = async (parametros) => {
    console.log(parametros);
    try {
      let respuesta;
      respuesta = await axios.post(url, parametros , {withCredentials:true});

      const msj = respuesta.data.message;

      console.log(respuesta);
      show_alerta(msj, "success");

      const token = respuesta.data.token;
      const decoded = jwtDecode(token);

      console.log(decoded.id);
      console.log(decoded.idRol);
      
      // show_alerta("Cliente creado con éxito", "success", { timer: 2000 });
      
    } catch (error) {
      if (error.response) {
        show_alerta(error.response.data.message, "error");
      } else if (error.request) {
        show_alerta("Error en la solicitud", "error");
      } else {
        show_alerta("Error desconocido", "error");
      }
      console.log(error);
    }
  };

  return (
    <>
      {/* <style jsx>{`
        .divider:after,
        .divider:before {
        content: "";
        flex: 1;
        height: 1px;
        background: #eee;
        }

      `}</style> */}


<section className="my-5">
      <div className="container py-5 h-100">
        <div className="row d-flex align-items-center justify-content-center h-100">
          <div className="col-md-8 col-lg-7 col-xl-6">
            <img 
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="img-fluid" 
              alt="Phone" 
            />
          </div>
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
          <div className="col-12 text-center">
            <h2 className="fw-bold my-4">Login</h2>
          </div>
            <div>
              {/* Uusario */}
              <div data-mdb-input-init className="form-outline mb-4">
                <input 
                  type="text" 
                  id="form1Example13" 
                  className={`form-control form-control-lg ${
                    errors.usuario ? "is-invalid" : ""
                  }`}
                  name="Usuario"
                  placeholder="Usuario" 
                  value={Usuario}
                  onChange={handleChangeUsuario}
                />
                {renderErrorMessage(errors.usuario)}
                <label className="form-label" htmlFor="form1Example13">Usuario</label>
              </div>

              {/* Contraseña */}
              <div data-mdb-input-init className="form-outline mb-4">
                <input 
                  type="password" 
                  id="form1Example23" 
                  className={`form-control form-control-lg ${
                    errors.contrasenia ? "is-invalid" : ""
                  }`}
                  name="password"
                  placeholder="Contraseña"
                  value={Contrasenia}
                  onChange={handleChangeContrasenia}
                />
                {renderErrorMessage(errors.contrasenia)}
                <label className="form-label" htmlFor="form1Example23">Password</label>
              </div>

              <div className="d-flex justify-content-around align-items-center mb-4">
                {/* Checkbox */}
                <div className="form-check">
                  
                <a href="#!">¿Perdiste tu contraseña?</a>
                </div>
              </div>

              {/* Submit button */}
              <button 
                data-mdb-button-init 
                data-mdb-ripple-init 
                className="btn btn-primary btn-lg btn-block"
                onClick={loguearUsuario}>
                Iniciar sesión
              </button>


             
            </div>
          </div>
        </div>
      </div>
    </section>


    </>
  );
};
