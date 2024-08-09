import React, { useState } from "react"; // Asegúrate de importar useState
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthProvider";

export const Login = () => {
  const [Usuario, setUsuario] = useState("");
  const [Contrasenia, setContrasenia] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña
  const url = "http://localhost:3000/api/authWeb/login";

  const {login} = useAuth();
  const navigate = useNavigate();

  const {auth} = useAuth();

  const [errors, setErrors] = useState({
    usuario: "",
    contrasenia: ""
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
      console.log("bazio:(");
      return "Escribe el usuario";
    }
    if (!/^[a-zA-Z0-9ñÑ-]+$/.test(value)) {
      console.log("carac :(");
      return "El nombre de usuario solo puede contener letras, números y guiones, sin espacios ni caracteres especiales";
    }
    if (value.length < 10 || value.length > 60) { 
      console.log("mecha corta :(");
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

    console.log(value);
    // Validar el usuario
    const errorMessage = validateUsuario(value);
    setErrors((prevState) => ({
      ...prevState,
      usuario: errorMessage,
    }));
  };

  const handleChangeContrasenia = (e) => {
    const value = e.target.value.replace(/\s+/g, ""); // Eliminar todos los espacios
    setContrasenia(value);

    console.log(value);

    const errorMessage = validateContrasenia(value);
    setErrors((prevState) => ({
      ...prevState,
      contrasenia: errorMessage,
    }));
  };

  const renderErrorMessage = (errorMessage) => {
    console.log(errors.usuario);
    console.log(errors.contrasenia);
    return errorMessage ? (
      <div className="invalid-feedback">{errorMessage}</div>
    ) : null;
  };

  const loguearCliente = async () => {
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
      await enviarSolicitud({
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
      respuesta = await axios.post(url, parametros, { withCredentials: true });

      const msj = respuesta.data.message;

      console.log(respuesta);
      show_alerta(msj, "success");

      const token = respuesta.data.token;
      // setToken(token);

      
      const decoded = jwtDecode(token);
      login(decoded,token);
      
      navigate('/');


      console.log(decoded);
      console.log(decoded.idCliente);
      console.log(decoded.nombre);
      
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
          <div className="w-100">
            <div className="mb-3 text-center">
              <label htmlFor="usuario" className="form-label">
                Usuario
              </label>
              <div className="col-12 col-md-3 mx-auto">
                <input
                  type="text"
                  className={`form-control ${
                    errors.usuario ? "is-invalid" : ""
                  }`}
                  name="Usuario"
                  id="usuario"
                  placeholder="Usuario"
                  value={Usuario}
                  onChange={handleChangeUsuario}
                />
                {renderErrorMessage(errors.usuario)}
              </div>
            </div>

            <div className="mb-3 text-center">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <div className="col-12 col-md-3 mx-auto input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${
                    errors.contrasenia ? "is-invalid" : ""
                  }`}
                  name="password"
                  id="password"
                  placeholder="Contraseña"
                  value={Contrasenia}
                  onChange={handleChangeContrasenia}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary mx-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                        <i className="fas fa-eye-slash"></i>
                      ) : (
                        <i className="fas fa-eye"></i>
                      )}
                </button>
                {renderErrorMessage(errors.contrasenia)}
              </div>
            </div>

            <div className="d-grid text-center">
              <div className="col-12 col-md-3 mx-auto">
                <button className="btn btn-success" onClick={loguearCliente}>
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
                ¿Perdiste tu contraseña? <Link to={"/RecuperarCliente"} >Recuperar contraseña</Link>
              </samp>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
