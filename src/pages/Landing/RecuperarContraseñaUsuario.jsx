import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import show_alerta from "../../components/Show_Alerta/show_alerta";

export const RecuperarContraseñaUsuario = () => {
  const [Correo, setCorreo] = useState("");
  const navigate = useNavigate();

  const urlRecuperar =
    "https://softshirt-1c3fad7d72e8.herokuapp.com/api/restablecerContraseniaUsuario";
  const [errors, setErrors] = useState({
    correo: "",
  });

  const handleChangeCorreo = (e) => {
    const value = e.target.value;
    setCorreo(value);
    const errorMessage = validateCorreo(value);
    setErrors((prevState) => ({
      ...prevState,
      correo: errorMessage,
    }));
  };

  const validateCorreo = (value) => {
    if (!value) {
      return "Ingresa tu correo electrónico";
    }
    if (/\s/.test(value)) {
      return "El correo electrónico no puede contener espacios";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Ingresa un correo electrónico válido";
    }
    const length = value.length;
    if (length < 10 || length > 50) {
      return "El correo debe tener entre 10 y 50 caracteres";
    }
    return "";
  };

  const renderErrorMessage = (errorMessage) => {
    return errorMessage ? (
      <div className="invalid-feedback">{errorMessage}</div>
    ) : null;
  };

  const validarCorreo = () => {
    if (!Correo) {
      show_alerta({
        message: "Ingresa tu correo electrónico",
        type: "error",
      });
      return;
    }
    if (/\s/.test(Correo)) {
      show_alerta({
        message: "El correo electrónico no puede contener espacios",
        type: "error",
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Correo)) {
      show_alerta({
        message: "Ingresa un correo electrónico válido",
        type: "error",
      });
      return;
    }
    const length = Correo.length;
    if (length < 10 || length > 50) {
      show_alerta({
        message: "El correo debe tener entre 10 y 50 caracteres",
        type: "error",
      });
      return;
    }
    restablecerContrasenia();
  };

  const restablecerContrasenia = async () => {
    try {
      let respuesta;
      respuesta = await axios.post(
        urlRecuperar,
        { Correo },
        { withCredentials: true }
      );
      

      const msj = respuesta.data.message;
      const token= respuesta.data.token;

      

      localStorage.setItem('RecuperarPass', token); 
      navigate("/");
      show_alerta({
        message: msj,
        type: "success",
      });
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
      {/* formulario */}
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="row w-100">
          <div className="col-12 col-md-6 mx-auto">
            <div className="p-5 bg-white rounded shadow">
              <div className="col-12 text-center">
                <h2 className="fw-bold mb-5">Recuperar contraseña</h2>
              </div>
              <div className="mb-3 text-center">
                <label htmlFor="Correo" className="form-label">
                  Correo del usuario
                </label>
                <div className="col-12">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.correo ? "is-invalid" : ""
                    }`}
                    id="Correo"
                    placeholder="Correo del usuario"
                    onChange={handleChangeCorreo}
                  />
                  {renderErrorMessage(errors.correo)}
                </div>
              </div>

              <div className="d-grid text-center">
                <div className="col-12">
                  <button
                    className="btn btn-primary  my-3"
                    onClick={validarCorreo}
                  >
                    Enviar email
                  </button>

                  <div className="my-2 text-center">
                    ¿Tienes cuenta? <Link to="/admin/Login">Inicio de sesión</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* FIN formulario */}
    </>
  );
};
