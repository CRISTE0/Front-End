import React from "react";
import { Link } from "react-router-dom";

export const Login = () => {
  
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
        // Selecciona la barra de progreso y ajusta su estilo
        const progressBar = MySwal.getTimerProgressBar();
        if (progressBar) {
          progressBar.style.backgroundColor = "black";
          progressBar.style.height = "6px";
        }
      },
    });
  };

  // Función para validar el correo electrónico
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

// Función para validar la contraseña
const validateContrasenia = (value) => {
  if (!value) {
    return "La contraseña es requerida";
  } else if (value.length < 8 || value.length > 15) {
    return "La contraseña debe tener entre 8 y 15 caracteres";
  }
  return "";
};

const handleChangeCorreo = (e) => {
  const value = e.target.value;
  setCorreo(value); // Actualiza el estado del correo electrónico

  // Valida el correo electrónico y obtiene el mensaje de error
  const errorMessage = validateCorreo(value);

  // Actualiza el estado de los errores con el mensaje de error correspondiente
  setErrors((prevState) => ({
    ...prevState,
    correo: errorMessage, // Actualiza el error de correo con el mensaje de error obtenido
  }));
};

const handleChangeContrasenia = (e) => {
  setContrasenia(e.target.value); // Actualiza el estado de la contraseña
  const errorMessage = validateContrasenia(e.target.value);
  setErrors((prevState) => ({
    ...prevState,
    contrasenia: errorMessage, // Actualiza el error de contraseña con el mensaje de error obtenido
  }));
};

// Función para renderizar los mensajes de error
const renderErrorMessage = (errorMessage) => {
  return errorMessage ? (
    <div className="invalid-feedback">{errorMessage}</div>
  ) : null;
};

const guardarCliente = async (e) => {
  e.preventDefault(); // Evita que el formulario se recargue

  const cleanedContrasenia = Contrasenia.trim();

  // Validaciones
  if (!TipoDocumento) {
    show_alerta("El tipo documento es necesario", "error");
    return;
  }

  if (!NroDocumento) {
    show_alerta("El número de documento es necesario", "error");
    return;
  }

  if (!NombreApellido) {
    show_alerta("El nombre y apellido son necesarios", "error");
    return;
  }

  if (!Telefono) {
    show_alerta("El teléfono es necesario", "error");
    return;
  }

  if (!Direccion) {
    show_alerta("La dirección es necesaria", "error");
    return;
  }

  if (!Correo) {
    show_alerta("El correo es necesario", "error");
    return;
  }

  if (!cleanedContrasenia) {
    show_alerta("La contraseña es requerida", "error");
    return;
  }

  try {
    if (IdCliente) {
      // Actualizar Cliente
      await enviarSolicitud("PUT", {
        IdCliente,
        TipoDocumento,
        NroDocumento,
        NombreApellido: cleanedNombreApellido,
        Telefono,
        Direccion: cleanedDireccion,
        Correo,
        Contrasenia: cleanedContrasenia,
      });
      show_alerta("Cliente actualizado exitosamente", "success");
    } else {
      // Crear Cliente
      await enviarSolicitud("POST", {
        TipoDocumento,
        NroDocumento,
        NombreApellido: cleanedNombreApellido,
        Telefono,
        Direccion: cleanedDireccion,
        Correo,
        Contrasenia: cleanedContrasenia,
        Estado: "Activo",
      });
      show_alerta("Cliente registrado exitosamente", "success");
    }
    
    // Limpiar los campos del formulario directamente aquí
    setTipoDocumento("");
    setNroDocumento("");
    setNombreApellido("");
    setTelefono("");
    setDireccion("");
    setCorreo("");
    setContrasenia("");
    setValcontrasenia("");
    setErrors({
      nroDocumento: "",
      nombreApellido: "",
      telefono: "",
      direccion: "",
      correo: "",
      contrasenia: "",
      valcontrasenia: "",
    });
  } catch (error) {
    // Manejo de errores en la solicitud
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
      {/* formulario */}
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
                />
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
                />
              </div>
            </div>
            <div className="d-grid text-center">
              <div className="col-12 col-md-3 mx-auto">
                <button type="submit" className="btn btn-success">
                  <a
                    className="text-white"
                    style={{ textDecoration: 'none' }}
                    href="../Admin/index.html"
                  >
                    Iniciar sesión
                  </a>
                </button>
              </div>
            </div>
            <div className="my-3 text-center">
              <samp>
                No tienes cuenta? <Link to={"/Register"} >Regístrate aquí</Link>
              </samp>
              <br />
              <samp>
                ¿Perdiste tu contraseña? <Link to={"/RecuperarContraseña"}>Recuperar contraseña</Link>
              </samp>
            </div>
          </form>
        </div>
      </div>
      {/* FIN formulario */}
    </>
  );
};





