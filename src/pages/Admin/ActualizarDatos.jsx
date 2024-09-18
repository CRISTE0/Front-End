import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate, useParams } from "react-router";
import Loader from "../../components/Loader/loader";
import show_alerta from "../../components/Show_Alerta/show_alerta";

export const ActualizarDatos = () => {
  const { id } = useParams();
  const navigate = useNavigate()
  const url = `https://softshirt-1c3fad7d72e8.herokuapp.com/api/clientes/${id}`;
  const [Clientes, setCliente] = useState([]);
  const [IdCliente, setIdCliente] = useState("");
  const [NombreApellido, setNombreApellido] = useState(
    Clientes.NombreApellido || ""
  );
  const [Usuario, setUsuario] = useState(Clientes.Usuario || "");
  const [Direccion, setDireccion] = useState(Clientes.Direccion || "");
  const [Contrasenia, setContrasenia] = useState(Clientes.Contrasenia || "");
  const [Telefono, setTelefono] = useState(Clientes.Telefono || "");
  const [Correo, setCorreo] = useState(Clientes.Correo || "");
  const [TipoDocumento, setTipoDocumento] = useState(
    Clientes.TipoDocumento || ""
  );
  const [NroDocumento, setNroDocumento] = useState(Clientes.NroDocumento || "");
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

  // Guardar los valores originales al cargar el componente
  const originalTipoDocumento = Clientes.TipoDocumento;
  const originalNroDocumento = Clientes.NroDocumento;
  const originalNombreApellido = Clientes.NombreApellido;
  const originalUsuario = Clientes.Usuario;
  const originalTelefono = Clientes.Telefono;
  const originalDireccion = Clientes.Direccion;
  const originalCorreo = Clientes.Correo;

  useEffect(() => {
    getClientes();
  }, []);

  const getClientes = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      const respuesta = await axios.get(url);
      // Puedes filtrar o manipular los datos aquí si es necesario
      setCliente(respuesta.data);
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

  const handleChangeTipoDocumento = (e) => {
    console.log(`pripra ocoro ${e.target.value}`);

    setCliente((prevClientes) => ({
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
    setCliente((prevClientes) => ({
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
    setCliente((prevClientes) => ({
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
    setCliente((prevClientes) => ({
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
    setCliente((prevClientes) => ({
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
    setCliente((prevClientes) => ({
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
    setCliente((prevClientes) => ({
      ...prevClientes,
      Correo: value,
    }));
    const errorMessage = validateCorreo(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      correo: errorMessage,
    }));
  };

  // Función para renderizar los mensajes de error
  const renderErrorMessage = (errorMessage) => {
    return errorMessage ? (
      <div className="invalid-feedback">{errorMessage}</div>
    ) : null;
  };

  const guardarCliente = async () => {
    // e.preventDefault();
    try {
      console.log(Clientes);

      let parametros = {
        IdCliente: Clientes.IdCliente,
        TipoDocumento: Clientes.TipoDocumento,
        NroDocumento: Clientes.NroDocumento,
        NombreApellido: Clientes.NombreApellido,
        Usuario: Clientes.Usuario,
        Telefono: Clientes.Telefono,
        Direccion: Clientes.Direccion,
        Correo: Clientes.Correo,
      };

      setLoading(true);

      console.log(parametros);

      await enviarSolicitud(parametros);
    } catch (error) {
      console.error("Error al actualizar los datos del cliente:", error);
      show_alerta({
        message: "Ocurrió un error al actualizar los datos del cliente",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const enviarSolicitud = async (parametros) => {
    // Verificar los parámetros para debug
    console.log(parametros);

    try {
      let respuesta;

      console.log(parametros);
      console.log(url);

      // return;

      respuesta = await axios.put(url, parametros); // Proporcionar URL y parámetrosl

      // Mostrar mensaje de éxito
      const msj = respuesta.data.message;
      if (msj) {
        show_alerta({
          message: msj,
          type: "success",
        });
      }

      navigate("/")

      getClientes();
    } catch (error) {
      // Manejo de errores
      if (error.response) {
        show_alerta({
          message: error.response.data.message,
          type: "error",
        });
      } else {
        console.log(error);
      }
    } finally {
      setIsSubmitting(false); // Finalizar estado de envío
    }
  };

  if (loading) {
    return <Loader />;
  }

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
              <div>
                <div className="row">
                  {/* Columna de la izquierda */}
                  <div className="col-md-6">
                    {/* Tipo Documento */}
                    <div className="mb-3">
                      <label htmlFor="tipoDocumento" className="form-label">
                        Tipo de documento
                      </label>
                      <select
                        className="form-control"
                        name="tipoDocumento"
                        id="tipoDocumento"
                        value={Clientes.TipoDocumento}
                        onChange={(e) => handleChangeTipoDocumento(e)}
                        required
                      >
                        <option disabled value="">
                          Seleccione un tipo de documento
                        </option>
                        <option value="CC">Cédula</option>
                        <option value="CE">Cédula de Extranjería</option>
                      </select>
                    </div>

                    {/* Número de Documento */}
                    <div className="mb-3">
                      <label htmlFor="nroDocumento" className="form-label">
                        Número de documento
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
                        defaultValue={Clientes.NroDocumento}
                        onChange={(e) => handleChangeNroDocumento(e)}
                      />
                      {renderErrorMessage(errors.nroDocumento)}
                    </div>

                    {/* Nombre y Apellido */}
                    <div className="mb-3">
                      <label htmlFor="nombreApellido" className="form-label">
                        Nombre y apellido
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
                        defaultValue={Clientes.NombreApellido}
                        onChange={(e) => handleChangeNombreApellido(e)}
                      />
                      {renderErrorMessage(errors.nombreApellido)}
                    </div>

                    {/* Nombre de Usuario */}
                    <div className="mb-4">
                      <label htmlFor="nombreUsuario" className="form-label">
                        Nombre de usuario
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
                        defaultValue={Clientes.Usuario}
                        onChange={(e) => handleChangeUsuario(e)}
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
                        defaultValue={Clientes.Telefono}
                        onChange={(e) => handleChangeTelefono(e)}
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
                        defaultValue={Clientes.Direccion}
                        onChange={(e) => handleChangeDireccion(e)}
                      />
                      {renderErrorMessage(errors.direccion)}
                    </div>

                    {/* Correo Electrónico */}
                    <div className="mb-3">
                      <label htmlFor="correo" className="form-label">
                        Correo electrónico
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
                        defaultValue={Clientes.Correo}
                        onChange={(e) => handleChangeCorreo(e)}
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
                    onClick={() => guardarCliente()}
                    disabled={isSubmitting}
                  >
                    Actualizar Datos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
