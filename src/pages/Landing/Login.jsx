import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthProvider";
import show_alerta from "../../components/Show_Alerta/show_alerta";

export const Login = () => {
  const [Usuario, setUsuario] = useState("");
  const [Contrasenia, setContrasenia] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const url = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/authWeb/login";
  const { login } = useAuth();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    usuario: "",
    contrasenia: "",
  });

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
      show_alerta({
        message: "El usuario es necesario",
        type: "error",
      });
      return;
    }

    if (!/^[a-zA-Z0-9ñÑ-]+$/.test(cleanedUsuario)) {
      show_alerta({
        message:
          "El nombre de usuario solo puede contener letras, números y caracteres especiales, sin espacios",
        type: "error",
      });
      return;
    }
    if (cleanedUsuario.length < 10 || cleanedUsuario.length > 60) {
      show_alerta({
        message: "El usuario debe tener entre 10 y 60 caracteres",
        type: "error",
      });
      return;
    }
    if (!cleanedContrasenia) {
      show_alerta({
        message: "La contraseña es requerida",
        type: "error",
      });
      return;
    }
    if (Contrasenia.length < 8 || Contrasenia.length > 15) {
      show_alerta({
        message: "La contraseña debe tener entre 8 y 15 caracteres",
        type: "error",
      });
      return;
    }

    try {
      await enviarSolicitud({ Usuario, Contrasenia });
    } catch (error) {
      if (error.response) {
        show_alerta({
          message: error.response.data.message,
          type: "error",
        });
      } else if (error.request) {
        show_alerta({
          message: "Error en la solicitud",
          type: "error",
        });
      } else {
        show_alerta({
          message: "Error desconocido",
          type: "error",
        });
      }
    }
  };

  const enviarSolicitud = async (parametros) => {
    try {
      const respuesta = await axios.post(url, parametros, {
        withCredentials: true,
      });
      const msj = respuesta.data.message;

      show_alerta({
        message: msj,
        type: "success",
      });

      const token = respuesta.data.token;
      const decoded = jwtDecode(token);
      await login(decoded, token);

      navigate("/");
    } catch (error) {
      if (error.response) {
        show_alerta({
          message: error.response.data.message,
          type: "error",
        });
      } else if (error.request) {
        show_alerta({
          message: "Error en la solicitud",
          type: "error",
        });
      } else {
        show_alerta({
          message: "Error desconocido",
          type: "error",
        });
      }
    }
  };

  return (
    <>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "400px" }}>
          <div className="text-center">
            <h2 className="fw-bold my-4">Iniciar sesión</h2>
          </div>
          <div className="mb-3">
            <label htmlFor="usuario" className="form-label">
              Usuario
            </label>
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
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <div className="input-group">
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
                className="btn btn-outline-secondary ml-2"
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

          <div className="d-grid text-center my-3">
            <button
              className="btn btn-success mx-auto"
              onClick={loguearCliente}
            >
              Iniciar sesión
            </button>
          </div>
          <div className="mt-4 text-center">
            ¿No tienes cuenta? <Link to={"/Register"}>Regístrate aquí</Link>
            <br />
            ¿Olvidaste tu contraseña?{" "}
            <Link to={"/RecuperarCliente"}>Recuperar contraseña</Link>
          </div>
        </div>
      </div>
    </>
  );
};
