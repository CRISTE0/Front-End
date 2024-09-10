import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useParams } from "react-router";
import Loader from "../../components/Loader/loader";

export const ActualizarDatos = () => {
  const { id } = useParams();
  const url = `http://localhost:3000/api/clientes/${id}`;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log(id);

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

  useEffect(() => {
    getClientes();
  }, []);

  const getClientes = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      const respuesta = await axios.get(url);
      // Puedes filtrar o manipular los datos aquí si es necesario
      setClientes(respuesta.data);
      console.log(respuesta.data);
    } catch (error) {
      console.error("Error fetching clientes:", error);
      // Puedes manejar el error aquí, como mostrar una alerta o mensaje de error
    } finally {
      setLoading(false); // Ocultar el loader después de la solicitud
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
    setClientes((prevClientes) => ({
      ...prevClientes,
      TipoDocumento: e.target.value, // Actualiza el tipo de documento
    }));
  };

  const handleChangeNroDocumento = (e) => {
    let value = e.target.value;
    // Limitar la longitud del valor ingresado a entre 6 y 10 caracteres
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setClientes((prevClientes) => ({
      ...prevClientes,
      NroDocumento: value,
    }));
    const errorMessage = validateNroDocumento(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      nroDocumento: errorMessage,
    }));
  };

  const handleChangeNombreApellido = (e) => {
    const value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio
    setClientes((prevClientes) => ({
      ...prevClientes,
      NombreApellido: value,
    }));
    const errorMessage = validateNombreApellido(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      nombreApellido: errorMessage,
    }));
  };

  const handleChangeUsuario = (e) => {
    const value = e.target.value.replace(/\s+/g, ""); // Eliminar todos los espacios
    setClientes((prevClientes) => ({
      ...prevClientes,
      Usuario: value,
    }));
    const errorMessage = validateUsuario(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      usuario: errorMessage,
    }));
  };

  const handleChangeTelefono = (e) => {
    let value = e.target.value;
    // Limitar la longitud del valor ingresado a 10 caracteres
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setClientes((prevClientes) => ({
      ...prevClientes,
      Telefono: value,
    }));
    const errorMessage = validateTelefono(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      telefono: errorMessage,
    }));
  };

  const handleChangeDireccion = (e) => {
    const value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio
    setClientes((prevClientes) => ({
      ...prevClientes,
      Direccion: value,
    }));
    const errorMessage = validateDireccion(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      direccion: errorMessage,
    }));
  };

  const handleChangeCorreo = (e) => {
    const value = e.target.value;
    setClientes((prevClientes) => ({
      ...prevClientes,
      Correo: value,
    }));
    const errorMessage = validateCorreo(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      correo: errorMessage,
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
      show_alerta("El tipo de documento es necesario", "error");
      return;
    }

    if (!NroDocumento || NroDocumento.length < 6) {
      show_alerta(
        "El número de documento debe tener al menos 6 caracteres",
        "error"
      );
      return;
    }

    if (!cleanedNombreApellido) {
      show_alerta("El nombre y apellido son necesarios", "error");
      return;
    }

    if (!cleanedUsuario) {
      show_alerta("El nombre de usuario es necesario", "error");
      return;
    }

    if (!Telefono || Telefono.length < 6) {
      show_alerta("El teléfono debe tener al menos 6 caracteres", "error");
      return;
    }

    if (!cleanedDireccion) {
      show_alerta("La dirección es necesaria", "error");
      return;
    }

    if (!Correo || !validateEmail(Correo)) {
      // Suponiendo que tienes una función validateEmail
      show_alerta("El correo electrónico es inválido", "error");
      return;
    }

    if (!cleanedContrasenia) {
      show_alerta("La contraseña es necesaria", "error");
      return;
    }

    if (!IdCliente) {
      show_alerta(
        "ID del cliente no está disponible para la actualización",
        "error"
      );
      return;
    }

    setLoading(true); // Mostrar el loader antes de realizar la solicitud

    try {
      // Solo incluir los datos que han cambiado
      const clienteData = {};
      if (NombreApellido !== originalNombreApellido)
        clienteData.NombreApellido = cleanedNombreApellido;
      if (Usuario !== originalUsuario) clienteData.Usuario = cleanedUsuario;
      if (Direccion !== originalDireccion)
        clienteData.Direccion = cleanedDireccion;
      if (Contrasenia !== originalContrasenia)
        clienteData.Contrasenia = cleanedContrasenia;
      if (Telefono !== originalTelefono) clienteData.Telefono = Telefono;
      if (Correo !== originalCorreo) clienteData.Correo = Correo;
      if (TipoDocumento !== originalTipoDocumento)
        clienteData.TipoDocumento = TipoDocumento;
      if (NroDocumento !== originalNroDocumento)
        clienteData.NroDocumento = NroDocumento;

      // Actualizar Cliente
      if (Object.keys(clienteData).length > 0) {
        await enviarSolicitud("PUT", {
          IdCliente,
          ...clienteData, // Incluye solo los datos del cliente que han cambiado
        });
        show_alerta("Datos del cliente actualizados exitosamente", "success");
      } else {
        show_alerta(
          "No se han realizado cambios en los datos del cliente",
          "info"
        );
      }
    } catch (error) {
      console.error("Error al actualizar los datos del cliente:", error);
      show_alerta(
        "Ocurrió un error al actualizar los datos del cliente",
        "error"
      );
    } finally {
      setLoading(false); // Ocultar el loader después de obtener la respuesta o en caso de error
    }
  };

  const enviarSolicitud = async (metodo, parametros) => {
    console.log(parametros);
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

      setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  //   if (loading) {
  //     return <Loader />;
  //   }

  return (
    <>
      {/* Contenedor principal del formulario */}
      <div
        className="container d-flex justify-content-center align-items-center bg-light"
        style={{ minHeight: "100vh", maxWidth: "3000px" }} // Aumenta el maxWidth
      >
        <div className="row w-100 justify-content-center">
          <div className="col-lg-8 col-md-10 col-sm-12">
            {/* Caja del formulario */}
            <div className="p-4 border rounded shadow-sm bg-white">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-dark">Datos Personales</h2>
              </div>
              <form onSubmit={guardarCliente}>
                <div className="row">
                  {/* Columna de la izquierda */}
                  <div className="col-md-6">
                    {/* Tipo Documento */}
                    <div className="mb-3">
                      <label htmlFor="tipoDocumento" className="form-label">
                        Tipo Documento
                      </label>
                      <select
                        className="form-control"
                        name="tipoDocumento"
                        id="tipoDocumento"
                        value={Clientes.TipoDocumento}
                        onChange={handleChangeTipoDocumento}
                        required
                      >
                        <option value="">
                          Seleccione un tipo de documento
                        </option>
                        <option value="CC">Cédula</option>
                        <option value="CE">Cédula de Extranjería</option>
                      </select>
                    </div>

                    {/* Número de Documento */}
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
                        value={Clientes.NroDocumento}
                        onChange={handleChangeNroDocumento}
                      />
                      {renderErrorMessage(errors.nroDocumento)}
                    </div>

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
                        value={Clientes.NombreApellido}
                        onChange={handleChangeNombreApellido}
                      />
                      {renderErrorMessage(errors.nombreApellido)}
                    </div>

                    {/* Nombre de Usuario */}
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
                        value={Clientes.Usuario}
                        onChange={handleChangeUsuario}
                      />
                      {renderErrorMessage(errors.usuario)}
                    </div>
                  </div>

                  {/* Columna de la derecha */}
                  <div className="col-md-6">
                    {/* Teléfono */}
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
                        value={Clientes.Telefono}
                        onChange={handleChangeTelefono}
                      />
                      {renderErrorMessage(errors.telefono)}
                    </div>

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
                        value={Clientes.Direccion}
                        onChange={handleChangeDireccion}
                      />
                      {renderErrorMessage(errors.direccion)}
                    </div>

                    {/* Correo Electrónico */}
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
                        value={Clientes.Correo}
                        onChange={handleChangeCorreo}
                      />
                      {renderErrorMessage(errors.correo)}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-success"
                    style={{ width: "150px", height: "40px" }}
                    disabled={isSubmitting}
                  >
                    Actualizar Datos
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
