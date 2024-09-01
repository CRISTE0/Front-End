import React, { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthProvider";

export const Login = () => {
  const [Usuario, setUsuario] = useState("");
  const [Contrasenia, setContrasenia] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const url = "http://localhost:3000/api/authWeb/login";
  const { login } = useAuth();
  const navigate = useNavigate();
  const { auth } = useAuth();

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
      return "Escribe el usuario";
    }
    if (!/^[a-zA-Z0-9ñÑ-]+$/.test(value)) {
      return "El nombre de usuario solo puede contener letras, números y guiones, sin espacios ni caracteres especiales";
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
    const value = e.target.value.replace(/\s+/g, "");
    setUsuario(value);

    const errorMessage = validateUsuario(value);
    setErrors((prevState) => ({
      ...prevState,
      usuario: errorMessage,
    }));
  };

  const handleChangeContrasenia = (e) => {
    const value = e.target.value.replace(/\s+/g, "");
    setContrasenia(value);

    const errorMessage = validateContrasenia(value);
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

  const loguearCliente = async () => {
    const cleanedContrasenia = Contrasenia.trim();
    const cleanedUsuario = Usuario.trim();
    
    if (!cleanedUsuario) {
      show_alerta("El usuario es necesario", "error");
      return;
    }

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
      await enviarSolicitud({ Usuario, Contrasenia });
    } catch (error) {
      if (error.response) {
        show_alerta(error.response.data.message, "error");
      } else if (error.request) {
        show_alerta("Error en la solicitud", "error");
      } else {
        show_alerta("Error desconocido", "error");
      }
    }
  };

  const enviarSolicitud = async (parametros) => {
    try {
      const respuesta = await axios.post(url, parametros, { withCredentials: true });
      const msj = respuesta.data.message;

      show_alerta(msj, "success");

      const token = respuesta.data.token;
      const decoded = jwtDecode(token);
      await login(decoded, token);
      
      navigate('/');
    } catch (error) {
      if (error.response) {
        show_alerta(error.response.data.message, "error");
      } else if (error.request) {
        show_alerta("Error en la solicitud", "error");
      } else {
        show_alerta("Error desconocido", "error");
      }
    }
  };

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="card p-4 shadow-lg w-100" style={{ maxWidth: '400px' }}>
          <div className="text-center">
            <h2 className="fw-bold my-4">Iniciar sesión</h2>
          </div>
          <div className="mb-3">
            <label htmlFor="usuario" className="form-label">Usuario</label>
            <input
              type="text"
              className={`form-control ${errors.usuario ? "is-invalid" : ""}`}
              name="Usuario"
              id="usuario"
              placeholder="Usuario"
              value={Usuario}
              onChange={handleChangeUsuario}
            />
            {renderErrorMessage(errors.usuario)}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <div>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="password"
                id="password"
                placeholder="Contraseña"
                value={Contrasenia}
                onChange={handleChangeContrasenia}
                style={{
                  borderColor: errors.contrasenia ? 'red' : '',
                  boxShadow: errors.contrasenia ? 'none' : '',
                }}
              >
              </input>
              <button
                type="button" //Todo esto es boostrap?
                className="border-0"
                onClick={() => setShowPassword(!showPassword)}
                style={{ height: '100%', display: 'flex', alignItems: 'center',  transform: 'translate(310px, -26px)', background: 'transparent' }}
              >
                <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
              </button>
            </div>
            {renderErrorMessage(errors.contrasenia)}
          </div>

          <div className="d-grid text-center my-3">
            <button className="btn btn-success mx-auto" onClick={loguearCliente}>
              Iniciar sesión
            </button>
          </div>
          <div className="mt-4 text-center">
              ¿No tienes cuenta? <Link to={"/Register"}>Regístrate aquí</Link>
            <br />
              ¿Olvidaste tu contraseña? <Link to={"/RecuperarCliente"}>Recuperar contraseña</Link>
          </div>
        </div>
      </div>
    </>
  );
};
