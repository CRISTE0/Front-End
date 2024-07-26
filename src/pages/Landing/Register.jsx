import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const Register = () => {
  const url = "http://localhost:3000/api/clientes";
  const [Clientes, setClientes] = useState([]);
  const [IdCliente, setIdCliente] = useState("");
  const [TipoDocumento, setTipoDocumento] = useState("");
  const [NroDocumento, setNroDocumento] = useState("");
  const [NombreApellido, setNombreApellido] = useState("");
  const [Usuario, setUsuario] = useState("");
  const [Telefono, setTelefono] = useState("");
  const [Direccion, setDireccion] = useState("");
  const [Correo, setCorreo] = useState("");
  const [Contrasenia, setContrasenia] = useState("");
  const [Valcontrasenia, setValcontrasenia] = useState("");
  const [errors, setErrors] = useState({
    nroDocumento: "",
    nombreApellido: "",
    usuario: "",
    telefono: "",
    direccion: "",
    correo: "",
    contrasenia: "",
    valcontrasenia: "",
  });

const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
const [showValPassword, setShowValPassword] = useState(false);

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

// Función para validar el número de documento
const validateNroDocumento = (value) => {
  if (!value) {
    return "Escribe el número de documento";
  }
  if (!/^\d+$/.test(value)) {
    return "El número de documento solo puede contener dígitos";
  }
  if (value.startsWith("0")) {
    return "El número de documento no puede empezar con cero";
  }
  if (value.length < 6 || value.length > 10) {
    return "El número de documento debe tener entre 6 y 10 dígitos";
  }
  return "";
};

const validateNombreApellido = (value) => {
  if (!value) {
    return "Escribe el nombre y apellido";
  }
  if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ]+( [A-Za-zñÑáéíóúÁÉÍÓÚ]+)*$/.test(value)) {
    return "El nombre y apellido solo puede contener letras, tildes y la letra 'ñ' con un solo espacio entre palabras";
  }
  return "";
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

// Función para validar el teléfono
const validateTelefono = (value) => {
  if (!value) {
    return "Escribe el teléfono";
  }
  if (!/^\d+$/.test(value)) {
    return "El teléfono solo puede contener dígitos";
  }
  if (value.startsWith("0")) {
    return "El teléfono no puede empezar con cero";
  }
  if (value.length !== 10) {
    return "El teléfono debe tener exactamente 10 dígitos";
  }
  return "";
};

// Función para validar la dirección
const validateDireccion = (value) => {
  if (!value) {
    return "Escribe la dirección";
  }
  if (/^\s/.test(value)) {
    return "La dirección no puede comenzar con un espacio";
  }
  if (!/^[a-zA-Z0-9#-\s]*$/.test(value)) {
    return "La dirección solo puede contener letras, números, # y -";
  }
  if (value.length < 10 || value.length > 50) {
    return "La dirección debe tener entre 10 y 50 caracteres";
  }
  return "";
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

// Función para validar la contraseña
const validateValContrasenia = (value, contrasenia) => {
  if (!value) {
    return "La validación de la contraseña es requerida";
  } else if (value !== contrasenia) {
    return "Las contraseñas no coinciden";
  }
  return "";
};

  const handleChangeTipoDocumento = (e) => {
    const value = e.target.value;
    setTipoDocumento(value);
  };

  const handleChangeNroDocumento = (e) => {
    let value = e.target.value;
    // Limitar la longitud del valor ingresado a entre 6 y 10 caracteres
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setNroDocumento(value);
    const errorMessage = validateNroDocumento(value);
    setErrors((prevState) => ({
      ...prevState,
      nroDocumento: errorMessage,
    }));
  };

  const handleChangeNombreApellido = (e) => {
    const value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio
    setNombreApellido(value);

    // Validar el nombre y apellido
    const errorMessage = validateNombreApellido(value);
    setErrors((prevState) => ({
      ...prevState,
      nombreApellido: errorMessage,
    }));
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

  const handleChangeTelefono = (e) => {
    let value = e.target.value;
    // Limitar la longitud del valor ingresado a 10 caracteres
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setTelefono(value);
    const errorMessage = validateTelefono(value);
    setErrors((prevState) => ({
      ...prevState,
      telefono: errorMessage,
    }));
  };

  const handleChangeDireccion = (e) => {
    const value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio
    setDireccion(value);

    // Validar la dirección
    const errorMessage = validateDireccion(value);
    setErrors((prevState) => ({
      ...prevState,
      direccion: errorMessage,
    }));
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

  

  const handleChangeValcontrasenia = (e) => {
    setValcontrasenia(e.target.value); // Actualiza el estado de la contraseña
    const errorMessage = validateValContrasenia(e.target.value, Contrasenia);
    setErrors((prevState) => ({
      ...prevState,
      valcontrasenia: errorMessage, // Actualiza el error de contraseña con el mensaje de error obtenido
    }));
  };

  // Función para renderizar los mensajes de error
  const renderErrorMessage = (errorMessage) => {
    return errorMessage ? (
      <div className="invalid-feedback">{errorMessage}</div>
    ) : null;
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Alternar el estado para mostrar/ocultar contraseña
  };

  const toggleShowValPassword = () => {
    setShowValPassword(!showValPassword); // Alternar el estado para mostrar/ocultar validar contraseña
  };

  const guardarCliente = async (e) => {
    e.preventDefault(); // Evita que el formulario se recargue
  
    const cleanedNombreApellido = NombreApellido.trim().replace(/\s+/g, " ");
    const cleanedUsuario = Usuario.trim().replace(/\s+/g, " ");
    const cleanedDireccion = Direccion.trim().replace(/\s+/g, " ");
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

    if (!Usuario) {
      show_alerta(
        "El usuario es necesario",
        "error"
      );
      return;
      
    }else if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ0-9!@#$%^&*(),.?":{}|<>]+(?: [A-Za-zñÑáéíóúÁÉÍÓÚ0-9!@#$%^&*(),.?":{}|<>]+)*$/.test(Usuario) ) {
      show_alerta(
        "El nombre de usuario puede contener letras, números, caracteres especiales, y un solo espacio entre palabras",
        "error"
      );
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
          Usuario: cleanedUsuario,
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
          Usuario: cleanedUsuario,
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
      setUsuario("");
      setTelefono("");
      setDireccion("");
      setCorreo("");
      setContrasenia("");
      setValcontrasenia("");
      setErrors({
        nroDocumento: "",
        nombreApellido: "",
        usuario: "",
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
  
  
  

  const enviarSolicitud = async (metodo, parametros) => {
    console.log(parametros)
    let urlRequest =
      metodo === "PUT" || metodo === "DELETE"
        ? `${url}/${parametros.IdCliente}`
        : url;

    try {
      let respuesta;
      if (metodo === "POST") {
        respuesta = await axios.post(url, parametros);
      } else if (metodo === "PUT") {
        respuesta = await axios.put(urlRequest, parametros);
      } else if (metodo === "DELETE") {
        respuesta = await axios.delete(urlRequest);
      }

      const msj = respuesta.data.message;
      show_alerta(msj, "success");
      document.getElementById("btnCerrarCliente").click();
      getClientes();
      if (metodo === "POST") {
        show_alerta("Cliente creado con éxito", "success", { timer: 2000 });
      } else if (metodo === "PUT") {
        show_alerta("Cliente actualizado con éxito", "success", {
          timer: 2000,
        });
      } else if (metodo === "DELETE") {
        show_alerta("Cliente eliminado con éxito", "success", { timer: 2000 });
      }
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
      {/* formulario */}
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="row w-100">
          <div className="col-12 text-center">
            <h2 className="fw-bold my-4">Register</h2>
          </div>
          <div className="w-100">
            <div className="row">
              <div className="col-md-6">
                {/* Tipo doc */}
                <div className="mb-3">
                  <label htmlFor="tipoDocumento" className="form-label">
                    Tipo Documento
                  </label>
                  <select
                    className="form-control"
                    name="tipoDocumento"
                    id="tipoDocumento"
                    value={TipoDocumento}
                    onChange={(e) => handleChangeTipoDocumento(e)}
                    required
                  >
                    <option value="">Seleccione un tipo de documento</option>
                    <option value="CC">Cédula</option>
                    <option value="CE">Cédula de Extranjería</option>
                  </select>

                  {TipoDocumento == "" && (
                    <p className="text-danger">
                      Por favor, seleccione un tipo de documento.
                    </p>
                  )}
                </div>
                {/* Fin tipo doc */}

                {/* Documento */}
                <div className="mb-3">
                  <label htmlFor="nroDocumento" className="form-label">
                    Número de Documento
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.nroDocumento ? "is-invalid" : ""
                    }`}
                    name="nroDocumento"
                    id="nroDocumento"
                    placeholder="Ingrese el número de documento"
                    required
                    value={NroDocumento}
                    onChange={handleChangeNroDocumento}
                  />
                  {renderErrorMessage(errors.nroDocumento)}
                  <small className="form-text text-muted">
                    Ingrese un documento válido (entre 6 y 10 dígitos
                    numéricos).
                  </small>
                </div>
                {/*Fin Documento */}

                {/* Nombre y Apellido */}
                <div className="mb-3">
                  <label htmlFor="nombreApellido" className="form-label">
                    Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.nombreApellido ? "is-invalid" : ""
                    }`}
                    name="nombreApellido"
                    id="nombreApellido"
                    placeholder="Nombre y Apellido"
                    required
                    value={NombreApellido}
                    onChange={handleChangeNombreApellido}
                  />
                  {renderErrorMessage(errors.nombreApellido)}
                </div>
                {/* fin Nombre y Apellido */}

                {/* Usuario */}
                <div className="mb-3">
                  <label htmlFor="nombreUsuario" className="form-label">
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.usuario ? "is-invalid" : ""
                    }`}
                    name="nombreUsuario"
                    id="nombreUsuario"
                    placeholder="Usuario"
                    required
                    value={Usuario}
                    onChange={handleChangeUsuario}
                  />
                  {renderErrorMessage(errors.usuario)}
                </div>
                {/* fin Usuario */}

                {/* validar contra */}
                <div className="mb-3">
                  <label htmlFor="valcontrasenia" className="form-label">
                    Validar Contraseña
                  </label>
                  <div className="d-flex align-items-center">
                  <input
                    type={showValPassword ? "text" : "password"}
                    className={`form-control ${
                      errors.valcontrasenia ? "is-invalid" : ""
                    }`}
                    name="valcontrasenia"
                    id="valcontraseña"
                    placeholder="Validar Contraseña"
                    value={Valcontrasenia}
                    onChange={handleChangeValcontrasenia}
                  />
                  <button
                          type="button"
                          className="btn btn-outline-secondary ml-2"
                          onClick={toggleShowValPassword}
                        >
                          {showValPassword ? (
                            <i className="fas fa-eye-slash"></i>
                          ) : (
                            <i className="fas fa-eye"></i>
                          )}
                        </button>
                </div>
                {renderErrorMessage(errors.valcontrasenia)}
              </div>
            </div>
              {/* fin val contra */}

              {/* Direccion */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="direccion" className="form-label">
                    Dirección
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.direccion ? "is-invalid" : ""
                    }`}
                    name="direccion"
                    id="direccion"
                    placeholder="Ingrese la dirección"
                    required
                    value={Direccion}
                    onChange={handleChangeDireccion}
                  />
                  {renderErrorMessage(errors.direccion)}
                </div>
                {/* fin dirección */}

                {/* correo */}
                <div className="mb-3">
                  <label htmlFor="correo">Correo Electrónico </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.correo ? "is-invalid" : ""
                    }`}
                    name="correo"
                    id="correo"
                    placeholder="Ingrese el correo electrónico"
                    required
                    value={Correo}
                    onChange={handleChangeCorreo}
                  />
                  {renderErrorMessage(errors.correo)}
                </div>
                {/*Fin correo */}

                {/* contraseña */}
                  <div className="mb-3">
                    <label htmlFor="contraseniaNuevo" className="form-label">
                      Contraseña
                    </label>
                    <div className="d-flex align-items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${
                        errors.contrasenia ? "is-invalid" : ""
                      }`}
                      name="contrasenia"
                      id="contraseniaNuevo"
                      placeholder="Contraseña"
                      value={Contrasenia}
                      onChange={handleChangeContrasenia}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary ml-2"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? (
                        <i className="fas fa-eye-slash"></i>
                      ) : (
                        <i className="fas fa-eye"></i>
                      )}
                    </button>
                  </div>
                  {renderErrorMessage(errors.contrasenia)}
                </div>
                
                {/*fin contraseña */}

                {/*Telefono */}
                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.telefono ? "is-invalid" : ""
                    }`}
                    name="telefono"
                    id="telefono"
                    placeholder="Ingrese el Teléfono"
                    required
                    value={Telefono}
                    onChange={handleChangeTelefono}
                  />
                  {renderErrorMessage(errors.telefono)}
                  <small className="form-text text-muted">
                    Ingrese un número de teléfono válido (10 dígitos).
                  </small>
                </div>
                {/*fin telefono */}
              </div>
            </div>

            <div className="d-grid text-center">
              <div className="col-12 col-md-3 mx-auto">
                <button className="btn btn-success" onClick={guardarCliente}>
                    Registrar
                </button>
              </div>
            </div>
            <div className="my-3 text-center">
              <samp>
                ¿Tienes cuenta? <a href="/Login">Ingresa aquí</a>
              </samp>
            </div>
          </div>
        </div>
      </div>
      {/* FIN formulario */}
    </>
  );
};