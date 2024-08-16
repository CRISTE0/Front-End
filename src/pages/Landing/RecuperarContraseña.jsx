import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { Link } from "react-router-dom";

export const RecuperarContraseña = () => {
  const [Correo, setCorreo] = useState("");
  const urlRecuperar =
    "http://localhost:3000/api/restablecerContraseniaCliente";

  const [errors, setErrors] = useState({
    correo: "",
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
      show_alerta("Ingresa tu correo electrónico", "error");
      return;
    }
    if (/\s/.test(Correo)) {
      show_alerta("El correo electrónico no puede contener espacios", "error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Correo)) {
      show_alerta("Ingresa un correo electrónico válido", "error");
      return;
    }
    const length = Correo.length;
    if (length < 10 || length > 50) {
      show_alerta("El correo debe tener entre 10 y 50 caracteres", "error");
      return;
    }
    restablecerContrasenia();
  };

  const restablecerContrasenia = async () => {
    try {
      const respuesta = await axios.post(
        urlRecuperar,
        { Correo },
        { withCredentials: true }
      );
      const msj = respuesta.data.message;
      show_alerta(msj, "success");
    } catch (error) {
      if (error.response) {
        show_alerta(error.response.data.message, "error");
      } else if (error.request) {
        show_alerta("Error en la solicitud", "error");
      } else {
        show_alerta("Error desconocido", "error");
        console.log(error);
      }
      console.log(error);
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
            <h2 className="fw-bold mb-5">Recuperar Contraseña</h2>
          </div>
          <div className="mb-3 text-center">
            <label htmlFor="correo" className="form-label">
              Correo
            </label>
            <input
              type="text"
              className={`form-control ${errors.correo ? "is-invalid" : ""}`}
              id="Correo"
              placeholder="Correo"
              onChange={handleChangeCorreo}
            />
            {renderErrorMessage(errors.correo)}
          </div>

          <div className="d-grid text-center">
            <button
              className="btn btn-success mx-auto my-4"
              onClick={validarCorreo}
            >
              Enviar Email
            </button>
            <div className="my-2 text-center">
            ¿Tienes cuenta? <Link to="/Login">Inicio de sesión</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
