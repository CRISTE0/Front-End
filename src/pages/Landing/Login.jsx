import React, { useState } from "react"; // Asegúrate de importar useState
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const Login = () => {
  const [Usuario, setUsuario] = useState("");
  const [Contrasenia, setContrasenia] = useState("");
  const url = "http://localhost:3000/api/authWeb/login";

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
    if (!Usuario) {
      show_alerta("El usuario es necesario", "error");
      return;
    }
    if (!cleanedContrasenia) {
      show_alerta("La contraseña es requerida", "error");
      return;
    }

    try {
      // Lógica para guardar el cliente
        // Crear Cliente
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
      console.log(decoded.name);
      
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
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="row w-100">
          <div className="col-12 text-center">
            <h2 className="fw-bold my-4">Login</h2>
          </div>
          <form action="#" className="w-100">
            <div className="mb-3 text-center">
              <label htmlFor="usuario" className="form-label">
                Usuario
              </label>
              <div className="col-12 col-md-3 mx-auto">
                <input
                  type="text"
                  className="form-control"
                  name="Usuario"
                  id="usuario"
                  placeholder="Usuario"
                  value={Usuario}
                  onChange={handleChangeUsuario}
                />
                {renderErrorMessage(errors.correo)}
              </div>
            </div>
            <div className="mb-3 text-center">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <div className="col-12 col-md-3 mx-auto">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  id="password"
                  placeholder="Contraseña"
                  value={Contrasenia}
                  onChange={handleChangeContrasenia}
                />
                {renderErrorMessage(errors.contrasenia)}
              </div>
            </div>
            <div className="d-grid text-center">
              <div className="col-12 col-md-3 mx-auto">
                <button type="submit" className="btn btn-success" onClick={guardarCliente}>
                  Iniciar sesión
                </button>
              </div>
            </div>
            <div className="my-3 text-center">
              <samp>
                No tienes cuenta? <Link to={"/Register"}>Regístrate aquí</Link>
              </samp>
              <br />
              <samp>
                ¿Perdiste tu contraseña? <Link to={"/RecuperarContraseña"}>Recuperar contraseña</Link>
              </samp>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
