import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

export const RecuperarContraseñaUsuario= () => {
  const [Correo, setCorreo] = useState("");
  const urlRecuperar = "http://localhost:3000/api/restablecerContraseniaUsuario";
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
      show_alerta ("Ingresa tu correo electrónico","error");
      return;
    }
    if (/\s/.test(Correo)) {
      show_alerta ("El correo electrónico no puede contener espacios","error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Correo)) {
      show_alerta ("Ingresa un correo electrónico válido","error");
      return;
    }
    const length = Correo.length;
    if (length < 10 || length > 50) {
      show_alerta ("El correo debe tener entre 10 y 50 caracteres","error");
      return;
    }
    restablecerContrasenia();
  }

  const restablecerContrasenia = async()=> {
    try {
      let respuesta;
      respuesta = await axios.post(urlRecuperar, {Correo} ,{withCredentials:true} );
      const msj = respuesta.data.message;
      show_alerta(msj, "success");
    } catch (error) {
      if (error.response) {
        show_alerta(error.response.data.message, "error");
      } else if (error.request) {
        show_alerta("Error en la solicitud", "error");
      } else {
        show_alerta("Error desconocido", "error");
      }
    }
  }

  return (
    <>
      {/* formulario */}
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="row w-100">
 
          <div className="col-12 col-md-6 mx-auto">
            <div className="p-4 bg-white rounded shadow">
            <div className="col-12 text-center">
            <h2 className="fw-bold my-5">Recuperar Contraseña</h2>
          </div>
              <div className="mb-3 text-center">
                <label htmlFor="correo" className="form-label">
                  Correo del Usuario
                </label>
                <div className="col-12">
                  <input
                    type="text"
                    className={`form-control ${errors.correo ? "is-invalid" : ""}`}
                    id="Correo"
                    placeholder="Correo del Usuario"
                    onChange={handleChangeCorreo}
                  />
                  {renderErrorMessage(errors.correo)}
                </div>
              </div>

              <div className="d-grid text-center">
                <div className="col-12">
                  <button className="btn btn-primary  my-3" onClick={validarCorreo}>
                    Enviar Email
                  </button>
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
