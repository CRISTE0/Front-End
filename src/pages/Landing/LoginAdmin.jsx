import React, { useState } from "react"; // Asegúrate de importar useState
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const LoginAdmin = () => {
  const [Usuario, setUsuario] = useState("");
  const [Contrasenia, setContrasenia] = useState("");

  const [errors, setErrors] = useState({
    correo: "",
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
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ!@#$%^&*(),.?":{}|<>]+$/.test(value)) {
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

  const guardarCliente = async (e) => {
    e.preventDefault();
    const cleanedContrasenia = Contrasenia.trim();
    if (!Correo) {
      show_alerta("El correo es necesario", "error");
      return;
    }
    if (!cleanedContrasenia) {
      show_alerta("La contraseña es requerida", "error");
      return;
    }

    try {
      // Lógica para guardar el cliente
      show_alerta("Operación exitosa", "success");
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
            <form>
              {/* Email input */}
              <div data-mdb-input-init className="form-outline mb-4">
                <input 
                  type="email" 
                  id="form1Example13" 
                  className="form-control form-control-lg" 
                />
                <label className="form-label" htmlFor="form1Example13">Email address</label>
              </div>

              {/* Password input */}
              <div data-mdb-input-init className="form-outline mb-4">
                <input 
                  type="password" 
                  id="form1Example23" 
                  className="form-control form-control-lg" 
                />
                <label className="form-label" htmlFor="form1Example23">Password</label>
              </div>

              <div className="d-flex justify-content-around align-items-center mb-4">
                {/* Checkbox */}
                <div className="form-check">
                  
                <a href="#!">Forgot password?</a>
                </div>
              </div>

              {/* Submit button */}
              <button 
                type="submit" 
                data-mdb-button-init 
                data-mdb-ripple-init 
                className="btn btn-primary btn-lg btn-block"
              >
                Sign in
              </button>


             
            </form>
          </div>
        </div>
      </div>
    </section>


    </>
  );
};
