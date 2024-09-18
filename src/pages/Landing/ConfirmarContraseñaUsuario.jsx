import React, { useEffect, useState } from "react"; // Asegúrate de importar useState
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthProvider";
import Cookies from "js-cookie";
import show_alerta from "../../components/Show_Alerta/show_alerta";

export const ConfirmarContraseniaUsuario = () => {
  const [Contrasenia, setContrasenia] = useState("");
  const [ConfirmarContrasenia, setConfirmarContrasenia] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña
  const [showPassword2, setShowPassword2] = useState(false);
  const [Correo, setCorreo] = useState(null);
  const url = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/enviarContraseniaNuevaUsuario";

  const { cookieParams } = useParams();

  // const { login } = useAuth();
  const navigate = useNavigate();

  // const { auth } = useAuth();
  const [errors, setErrors] = useState({
    contrasenia: "",
    confirmarcontrasenia: "",
  });

  useEffect(() => {
    validarCookie();
  });

  const validarCookie = () => {
    const token = localStorage.getItem('RecuperarPass');

    // let cookie = Cookies.get("RecuperarPass");

    if (token) {
      if (token == cookieParams) {
        const decode = jwtDecode(token);
        console.log(decode.Correo);
        console.log(cookieParams);

        setCorreo(decode.Correo);
      } else {
        show_alerta({
          message:
            "El tiempo para recuperar la contraseña a expirado, intentelo de nuevo",
          type: "error",
        });
        navigate("/RecuperarUsuario");
      }
    } else {
      show_alerta({
        message:
          "El tiempo para recuperar la contraseña a expirado, intentelo de nuevo",
        type: "error",
      });
      navigate("/RecuperarUsuario");
    }
  };

  const validateContrasenia = (value, confirmValue) => {
    if (!value) {
      return "La contraseña es requerida";
    } else if (value.length < 8 || value.length > 15) {
      return "La contraseña debe tener entre 8 y 15 caracteres";
    }

    if (value !== confirmValue) {
      return "Las contraseñas deben ser iguales";
    }

    return "";
  };

  const validateConfirmarContrasenia = (value, contrasenia) => {
    if (!value) {
      return "La contraseña es requerida";
    } else if (value.length < 8 || value.length > 15) {
      return "La contraseña debe tener entre 8 y 15 caracteres";
    }

    if (value !== contrasenia) {
      return "Las contraseñas deben ser iguales";
    }

    return "";
  };

  const handleChangeContrasenia = (e) => {
    const value = e.target.value.replace(/\s+/g, ""); // Eliminar todos los espacios
    setContrasenia(value);

    const errorMessage = validateContrasenia(value, ConfirmarContrasenia);
    setErrors((prevState) => ({
      ...prevState,
      contrasenia: errorMessage,
      confirmarcontrasenia: validateConfirmarContrasenia(
        ConfirmarContrasenia,
        value
      ), // Actualizar también el error de confirmación
    }));
  };

  const handleChangeConfirmarContrasenia = (e) => {
    const value = e.target.value.replace(/\s+/g, ""); // Eliminar todos los espacios
    setConfirmarContrasenia(value);

    const errorMessage = validateConfirmarContrasenia(value, Contrasenia);
    setErrors((prevState) => ({
      ...prevState,
      confirmarcontrasenia: errorMessage,
      contrasenia: validateContrasenia(Contrasenia, value), // Actualizar también el error de la contraseña
    }));
  };

  const renderErrorMessage = (errorMessage) => {
    return errorMessage ? (
      <div className="invalid-feedback">{errorMessage}</div>
    ) : null;
  };

  const restablecerContrasenia = async () => {
    // e.preventDefault();
    const cleanedContrasenia = Contrasenia.trim();
    const cleanedConfirmarContrasenia = ConfirmarContrasenia.trim();

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
    if (!cleanedConfirmarContrasenia) {
      show_alerta({
        message: "La contraseña es requerida",
        type: "error",
      });
      return;
    }
    if (ConfirmarContrasenia.length < 8 || ConfirmarContrasenia.length > 15) {
      show_alerta({
        message: "La contraseña debe tener entre 8 y 15 caracteres",
        type: "error",
      });
      return;
    }

    if (
      Contrasenia != ConfirmarContrasenia ||
      ConfirmarContrasenia != Contrasenia
    ) {
      show_alerta({
        message: "Las contraseñas deben ser iguales",
        type: "error",
      });
      return;
    }

    try {
      let cookie = Cookies.get("RecuperarPass");

      console.log(cookie);

      // return;

      // Lógica para guardar el cliente
      await enviarSolicitud({
        Correo,
        Contrasenia,
      });

      // show_alerta("Operación exitosa", "success");
    } catch (error) {
      if (error.response) {
        show_alerta({
          message: error.response.data.message, type: "error"
        });
      } else if (error.request) {
        show_alerta({
          message: "Error en la solicitud", type: "error"
        });
      } else {
        show_alerta({
          message: "Error desconocido", type: "error"
        });
      }
      console.log(error);
    }
  };

  const enviarSolicitud = async (parametros) => {
    console.log(parametros);
    try {
      let respuesta;
      respuesta = await axios.post(url, parametros);

      const msj = respuesta.data.message;

      console.log(respuesta);
      show_alerta({
        message: msj, type: "success"
      });
      
      navigate("/admin/Login");
      localStorage.removeItem("RecuperarPass");
      
    } catch (error) {
      if (error.response) {
        show_alerta({
          message: error.response.data.message, type: "error"
        });
      } else if (error.request) {
        show_alerta({
          message: "Error en la solicitud", type: "error"
        });
      } else {
        show_alerta({
          message: "Error desconocido", type: "error"
        });
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
        <div className="row w-100">
          <div className="col-12 text-center">
            <h2 className="fw-bold my-4">Nueva contraseña Usuario</h2>
          </div>
          <div className="w-100">
            <div className="mb-3 text-center">
              <label htmlFor="contrasenia" className="form-label">
                Contraseña Usuario
              </label>
              <div className="col-12 col-md-3 mx-auto input-group">
                <input
                  type={showPassword ? "text" : "contrasenia"}
                  className={`form-control ${
                    errors.contrasenia ? "is-invalid" : ""
                  }`}
                  name="contrasenia"
                  id="contrasenia"
                  placeholder="Contraseña Usuario"
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

            <div className="mb-3 text-center">
              <label htmlFor="confirmarContrasenia" className="form-label">
                Confirmar Contraseña Usuario
              </label>
              <div className="col-12 col-md-3 mx-auto input-group">
                <input
                  type={showPassword2 ? "text" : "confirmarContrasenia"}
                  className={`form-control ${
                    errors.confirmarcontrasenia ? "is-invalid" : ""
                  }`}
                  name="confirmarContrasenia"
                  id="confirmarContrasenia"
                  placeholder="Confirmar Contraseña"
                  value={ConfirmarContrasenia}
                  onChange={handleChangeConfirmarContrasenia}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary mx-1"
                  onClick={() => setShowPassword2(!showPassword2)}
                >
                  {showPassword2 ? (
                    <i className="fas fa-eye-slash"></i>
                  ) : (
                    <i className="fas fa-eye"></i>
                  )}
                </button>
                {renderErrorMessage(errors.confirmarcontrasenia)}
              </div>
            </div>

            <div className="d-grid text-center">
              <div className="col-12 col-md-3 mx-auto">
                <button
                  className="btn btn-success"
                  onClick={restablecerContrasenia}
                >
                  Actualizar
                </button>
              </div>
            </div>
            {/* <div className="my-3 text-center">
              <samp>
                No tienes cuenta? <Link to={"/Register"}>Regístrate aquí</Link>
              </samp>
              <br />
              <samp>
                ¿Perdiste tu contraseña?{" "}
                <Link to={"RecuperarCliente"}>Recuperar contraseña</Link>
              </samp>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};
