import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import show_alerta from "../../components/Show_Alerta/show_alerta";

export const Register = () => {
  const url = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/clientes";
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

  const getClientes = async () => {
    try {
      const response = await axios.get(url); // Asegúrate de usar la URL correcta
      // Procesa los datos de la respuesta, por ejemplo, actualizando el estado
      setClientes(response.data);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
      show_alerta({
        message: "Error al obtener los clientes",
        type: "error",
      });
    }
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

    // Validaciones locales
    if (!TipoDocumento) {
      show_alerta({
        message: "El tipo documento es necesario",
        type: "error",
      });
      return;
    }

    if (!NroDocumento) {
      show_alerta({
        message: "El número de documento es necesario",
        type: "error",
      });
      return;
    }

    if (!NombreApellido) {
      show_alerta({
        message: "El nombre y apellido son necesarios",
        type: "error",
      });
      return;
    }

    if (!Usuario) {
      show_alerta({
        message: "El usuario es necesario",
        type: "error",
      });
      return;
    } else if (
      !/^[A-Za-zñÑáéíóúÁÉÍÓÚ0-9!@#$%^&*(),.?":{}|<>]+(?: [A-Za-zñÑáéíóúÁÉÍÓÚ0-9!@#$%^&*(),.?":{}|<>]+)*$/.test(
        Usuario
      )
    ) {
      show_alerta({
        message:
          "El nombre de usuario puede contener letras, números, caracteres especiales, y un solo espacio entre palabras",
        type: "error",
      });
      return;
    }

    if (!Telefono) {
      show_alerta({
        message: "El teléfono es necesario",
        type: "error",
      });
      return;
    }

    if (!Direccion) {
      show_alerta({
        message: "La dirección es necesaria",
        type: "error",
      });
      return;
    }

    if (!Correo) {
      show_alerta({
        message: "El correo es necesario",
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

    try {
      let response;

      if (IdCliente) {
        // Actualizar Cliente
        response = await enviarSolicitud("PUT", {
          url: `${url}/${IdCliente}`,
          data: {
            TipoDocumento,
            NroDocumento,
            NombreApellido: cleanedNombreApellido,
            Usuario: cleanedUsuario,
            Telefono,
            Direccion: cleanedDireccion,
            Correo,
            Contrasenia: cleanedContrasenia,
          },
        });
        show_alerta({
          message: response.data.message || "Cliente actualizado exitosamente",
          type: "success",
        });
      } else {
        // Crear Cliente
        response = await enviarSolicitud("POST", {
          url: url,
          data: {
            TipoDocumento,
            NroDocumento,
            NombreApellido: cleanedNombreApellido,
            Usuario: cleanedUsuario,
            Telefono,
            Direccion: cleanedDireccion,
            Correo,
            Contrasenia: cleanedContrasenia,
            Estado: "Activo",
          },
        });
        show_alerta({
          message: response.data.message || "Cliente registrado exitosamente",
          type: "success",
        });
      }

      // Limpiar los campos del formulario
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

      // Cerrar el modal y actualizar la lista de clientes
      document.getElementById("btnCerrarCliente")?.click();
      getClientes();
    } catch (error) {
      // Manejo de errores en la solicitud
      if (error.response) {
        if (error.response.data.errors) {
          // Mostrar errores de validación específicos del backend
          const erroresBackend = error.response.data.errors;
          for (const [campo, mensaje] of Object.entries(erroresBackend)) {
            show_alerta({
              message: mensaje,
              type: "error",
            });
          }
        } else {
          show_alerta({
            message: error.response.data.message || "Error en la solicitud",
            type: "error",
          });
        }
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
      console.log(error);
    }
  };

  const enviarSolicitud = async (metodo, { url, data }) => {
    console.log({ url, data });

    let urlRequest =
      metodo === "PUT" || metodo === "DELETE"
        ? `${url}/${data.IdCliente}`
        : url;

    try {
      let respuesta;

      switch (metodo) {
        case "POST":
          respuesta = await axios.post(url, data);
          break;
        case "PUT":
          respuesta = await axios.put(urlRequest, data);
          break;
        case "DELETE":
          respuesta = await axios.delete(urlRequest);
          break;
        default:
          throw new Error("Método no soportado");
      }

      // Mostrar alerta de éxito (opcional, puedes ajustar esto según sea necesario)
      const msj = respuesta.data.message || "Operación realizada con éxito";
      show_alerta({
        message: msj,
        type: "success",
      });

      // Retornar la respuesta para manejarla en la función que llama
      return respuesta;
    } catch (error) {
      // Manejo de errores
      if (error.response) {
        show_alerta({
          message: error.response.data.message || "Error en la solicitud",
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
      console.log(error);

      // Propagar el error para que pueda ser manejado en la función que llama
      throw error;
    }
  };

  return (
    <>
      {/* Contenedor principal del formulario */}
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", maxWidth: "3000px" }} // Aumenta el maxWidth
      >
        <div className="row w-100 justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-10">
            {/* Caja del formulario */}
            <div className="p-4 border rounded shadow-sm bg-white">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Regístrate</h2>
              </div>
              <form onSubmit={guardarCliente}>
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
                        onChange={handleChangeTipoDocumento}
                        required
                      >
                        <option value="">
                          Seleccione un tipo de documento
                        </option>
                        <option value="CC">Cédula</option>
                        <option value="CE">Cédula de Extranjería</option>
                      </select>
                      {TipoDocumento === "" && (
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
                    </div>
                    {/* Fin Documento */}

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
                    {/* Fin Nombre y Apellido */}

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
                    {/* Fin Usuario */}
                    {/* Dirección */}
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
                        placeholder="Ingrese el teléfono"
                        required
                        value={Telefono}
                        onChange={handleChangeTelefono}
                      />
                      {renderErrorMessage(errors.telefono)}
                    </div>
                    {/* Fin dirección */}
                  </div>

                  <div className="col-md-6">
                    {/* Dirección */}
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
                    {/* Fin dirección */}

                    {/* Correo */}
                    <div className="mb-3">
                      <label htmlFor="correo" className="form-label">
                        Correo Electrónico
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.correo ? "is-invalid" : ""
                        }`}
                        name="correo"
                        id="correo"
                        placeholder="Ingrese su correo electrónico"
                        required
                        value={Correo}
                        onChange={handleChangeCorreo}
                      />
                      {renderErrorMessage(errors.correo)}
                    </div>
                    {/* Fin Correo */}

                    {/* Contraseña */}
                    <div className="mb-3">
                      <label htmlFor="contrasenia" className="form-label">
                        Contraseña
                      </label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`form-control ${
                            errors.contrasenia ? "is-invalid" : ""
                          }`}
                          name="contrasenia"
                          id="contrasenia"
                          placeholder="Ingrese su contraseña"
                          required
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
                        {renderErrorMessage(errors.contrasenia)}
                      </div>
                    </div>
                    {/* Fin Contraseña */}

                    {/* Validar Contraseña */}
                    <div className="mb-3">
                      <label htmlFor="valcontrasenia" className="form-label">
                        Validar Contraseña
                      </label>
                      <div className="input-group">
                        <input
                          type={showValPassword ? "text" : "password"}
                          className={`form-control ${
                            errors.valcontrasenia ? "is-invalid" : ""
                          }`}
                          name="valcontrasenia"
                          id="valcontrasenia"
                          placeholder="Validar Contraseña"
                          required
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
                        {renderErrorMessage(errors.valcontrasenia)}
                      </div>
                    </div>
                    {/* Fin Validar Contraseña */}
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-success"
                    style={{ width: "150px", height: "40px" }} // Ajusta el ancho y la altura
                  >
                    Registrar
                  </button>
                </div>
                <div className="my-3 text-center">
                  <samp>
                    ¿Tienes cuenta? <a href="/Login">Ingresa aquí</a>
                  </samp>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
