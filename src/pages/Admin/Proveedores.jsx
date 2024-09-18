import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";
import show_alerta from "../../components/Show_Alerta/show_alerta";
import { AdminFooter } from "../../components/Admin/AdminFooter";
import Loader from "../../components/Loader/loader";

export const Proveedores = () => {
  let url = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/proveedores";
  const comprasUrl = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/compras";
  const [Proveedores, setProveedores] = useState([]);
  const [IdProveedor, setIdProveedor] = useState("");
  const [TipoDocumento, setTipoDocumento] = useState("");
  const [NroDocumento, setNroDocumento] = useState("");
  const [NombreApellido, setNombreApellido] = useState("");
  const [Contacto, setContacto] = useState("");
  const [Telefono, setTelefono] = useState("");
  const [Direccion, setDireccion] = useState("");
  const [Correo, setCorreo] = useState("");
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    nroDocumento: "",
    nombreApellido: "",
    contacto: "",
    telefono: "",
    direccion: "",
    correo: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [NombreApellidoLabel, setNombreApellidoLabel] = useState(
    "Nombre y apellido del proveedor"
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getProveedores();
  }, []);

  const getProveedores = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      const response = await axios.get(url);
      setProveedores(response.data);
    } catch (error) {
      console.error("Error fetching proveedores:", error);
    } finally {
      setLoading(false); // Ocultar el loader después de obtener los proveedores
    }
  };

  const getComprasByProveedor = async (IdProveedor) => {
    try {
      const response = await axios.get(comprasUrl);
      // Verifica si el proveedor está asociado a alguna compra
      const compras = response.data.filter(
        (compra) => compra.IdProveedor === IdProveedor
      );
      return compras.length > 0; // Devuelve true si hay al menos una compra asociada
    } catch (error) {
      console.error("Error fetching compras:", error);
      show_alerta({ message: "Error al verificar las compras", type: "error" });
      return false; // Considera que no tiene compras asociadas en caso de error
    }
  };

  const openModal = (op, proveedor = null) => {
    if (op === 1) {
      // Crear Proveedor
      setIdProveedor("");
      setTipoDocumento("");
      setNroDocumento("");
      setNombreApellido("");
      setContacto("");
      setTelefono("");
      setDireccion("");
      setCorreo("");
      setOperation(1);
      setTitle("Crear Proveedor");
      setNombreApellidoLabel("Nombre y apellido del proveedor");
    } else if (op === 2 && proveedor) {
      // Actualizar Proveedor
      setIdProveedor(proveedor.IdProveedor);
      setTipoDocumento(proveedor.TipoDocumento);
      setNroDocumento(proveedor.NroDocumento);
      setNombreApellido(proveedor.NombreApellido);
      setContacto(
        proveedor.TipoDocumento === "CC" || proveedor.TipoDocumento === "CE"
          ? proveedor.NombreApellido
          : proveedor.Contacto
      );
      setTelefono(proveedor.Telefono);
      setDireccion(proveedor.Direccion);
      setCorreo(proveedor.Correo);
      setOperation(2);
      setTitle("Actualizar Datos");
      setErrors({
        nroDocumento: "",
        nombreApellido: "",
        contacto: "",
        telefono: "",
        direccion: "",
        correo: "",
      });
      const errors = {
        nroDocumento: validateNroDocumento(proveedor.NroDocumento),
        nombreApellido: validateNombreApellido(proveedor.NombreApellido),
        contacto: validateContacto(proveedor.Contacto),
        telefono: validateTelefono(proveedor.Telefono),
        direccion: validateDireccion(proveedor.Direccion),
        correo: validateCorreo(proveedor.Correo),
      };
      setErrors(errors);
      setNombreApellidoLabel(
        proveedor.TipoDocumento === "NIT"
          ? "Nombre de la Empresa"
          : "Nombre y apellido del proveedor"
      );
    }
  };

  const guardarProveedor = async () => {
    // Verificar si todos los campos están completos
    if (!validateAllFields()) {
      // Si hay errores de validación, no continuar
      show_alerta({
        message: "Por favor, completa todos los campos correctamente",
        type: "error",
      });
      return;
    }

    // Limpiar los valores de los campos
    const cleanedNombreApellido = NombreApellido.trim().replace(/\s+/g, " ");
    const cleanedDireccion = Direccion.trim().replace(/\s+/g, " ");
    const cleanedContacto = Contacto.trim().replace(/\s+/g, " ");

    if (operation === 1) {
      // Crear Proveedor
      await enviarSolicitud("POST", {
        TipoDocumento,
        NroDocumento,
        NombreApellido: cleanedNombreApellido,
        Contacto: cleanedContacto,
        Telefono,
        Direccion: cleanedDireccion,
        Correo,
        Estado: "Activo",
      });
    } else if (operation === 2) {
      // Actualizar Proveedor
      await enviarSolicitud("PUT", {
        IdProveedor,
        TipoDocumento,
        NroDocumento,
        NombreApellido: cleanedNombreApellido,
        Contacto: cleanedContacto,
        Telefono,
        Direccion: cleanedDireccion,
        Correo,
      });
    }
  };

  // Función para validar el número de documento
  const validateNroDocumento = (value, tipoDocumento) => {
    if (!value) {
      return "Escribe el número de documento";
    }
    if (!/^\d+$/.test(value)) {
      return "El número de documento solo puede contener dígitos";
    }
    if (value.startsWith("0")) {
      return "El número de documento no puede comenzar con 0";
    }
    if (/^0+$/.test(value)) {
      return "El número de documento no puede ser todo ceros";
    }
    const length = value.length;
    if (tipoDocumento === "NIT" && (length < 9 || length > 10)) {
      return "El NIT debe tener entre 9 y 10 dígitos";
    }
    if (tipoDocumento === "CC" && (length < 6 || length > 10)) {
      return "El número de documento debe tener entre 6 y 10 dígitos";
    }
    if (tipoDocumento === "CE" && (length < 6 || length > 7)) {
      return "El número de documento debe tener entre 6 y 7 dígitos";
    }
    return "";
  };

  // Función para validar el nombre y apellido
  const validateNombreApellido = (value) => {
    if (!value) {
      return "Escribe el nombre y apellido";
    }
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
      return "El nombre y apellido solo puede contener letras con tildes, números, la letra 'ñ' y espacios";
    }
    const length = value.length;
    if (length < 2 || length > 60) {
      return "El nombre y apellido debe tener entre 2 y 60 caracteres";
    }
    return "";
  };

  // Función para validar el contacto
  const validateContacto = (value) => {
    if (!value) {
      return "Escribe el nombre del contacto";
    }
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
      return "El contacto solo puede contener letras con tildes, números, la letra 'ñ' y espacios";
    }
    const length = value.length;
    if (length < 2 || length > 60) {
      return "El contacto debe tener entre 2 y 60 caracteres";
    }
    return "";
  };

  // Función para validar el teléfono
  const validateTelefono = (value) => {
    if (!value) {
      return "Escribe el teléfono";
    }
    // El teléfono debe contener solo dígitos
    if (!/^\d+$/.test(value)) {
      return "El teléfono solo puede contener dígitos";
    }
    // El teléfono debe comenzar con 3
    if (!value.startsWith("3")) {
      return "El número de teléfono móvil debe comenzar con 3";
    }
    // El teléfono debe tener exactamente 10 dígitos
    if (!/^\d{10}$/.test(value)) {
      return "El teléfono debe tener exactamente 10 dígitos";
    }
    // El teléfono no debe comenzar con 0
    if (value.startsWith("0")) {
      return "El teléfono no puede comenzar con 0";
    }
    // El teléfono no debe ser todo ceros
    if (/^0+$/.test(value)) {
      return "El teléfono no puede ser todo ceros";
    }
    return "";
  };

  // Función para validar la dirección
  const validateDireccion = (value) => {
    if (!value) {
      return "Escribe la dirección";
    }
    if (!/^[a-zA-Z0-9\s#-]*$/.test(value)) {
      return "La dirección solo puede contener letras, números, espacios, '#' y '-'";
    }
    const length = value.length;
    if (length < 10 || length > 50) {
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
    const value = e.target.value;
    setTipoDocumento(value);
    setNombreApellidoLabel(
      value === "NIT"
        ? "Nombre de la Empresa"
        : "Nombre y apellido del proveedor"
    );

    // Validar el número de documento al cambiar el tipo de documento
    const errorMessage = validateNroDocumento(NroDocumento, value);
    setErrors((prevState) => ({
      ...prevState,
      nroDocumento: errorMessage,
    }));
  };

  // Función para manejar cambios en el número de documento
  const handleChangeNroDocumento = (e) => {
    let value = e.target.value;
    // Limitar la longitud del valor ingresado a 10 caracteres
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setNroDocumento(value);
    const errorMessage = validateNroDocumento(value, TipoDocumento);
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

    // Rellenar Contacto si TipoDocumento es "CC" o "CE"
    if (TipoDocumento === "CC" || TipoDocumento === "CE") {
      setContacto(value);
      // También validar y actualizar error de contacto
      const contactoErrorMessage = validateContacto(value);
      setErrors((prevState) => ({
        ...prevState,
        contacto: contactoErrorMessage,
      }));
    }
  };

  const handleChangeContacto = (e) => {
    const value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio
    setContacto(value);

    // Validar el contacto
    const errorMessage = validateContacto(value);
    setErrors((prevState) => ({
      ...prevState,
      contacto: errorMessage,
    }));
  };

  // Función para manejar cambios en el teléfono
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

  // Función para manejar cambios en la dirección
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

  // Función para manejar cambios en el correo electrónico
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

  const validateAllFields = () => {
    const nroDocumentoError = validateNroDocumento(NroDocumento, TipoDocumento);
    const nombreApellidoError = validateNombreApellido(NombreApellido);
    const contactoError = validateContacto(Contacto);
    const telefonoError = validateTelefono(Telefono);
    const direccionError = validateDireccion(Direccion);
    const correoError = validateCorreo(Correo);

    setErrors({
      nroDocumento: nroDocumentoError,
      nombreApellido: nombreApellidoError,
      contacto: contactoError,
      telefono: telefonoError,
      direccion: direccionError,
      correo: correoError,
    });

    return (
      !nroDocumentoError &&
      !nombreApellidoError &&
      !contactoError &&
      !telefonoError &&
      !direccionError &&
      !correoError
    );
  };

  // Función para renderizar los mensajes de error
  const renderErrorMessage = (errorMessage) => {
    return errorMessage ? (
      <div className="invalid-feedback">{errorMessage}</div>
    ) : null;
  };

  const enviarSolicitud = async (metodo, parametros) => {
    let urlRequest =
      metodo === "PUT" || metodo === "DELETE"
        ? `${url}/${parametros.IdProveedor}`
        : url;

    try {
      const respuesta = await axios({
        method: metodo,
        url: urlRequest,
        data: parametros,
      });

      const msj = respuesta.data.message;
      show_alerta({ message: msj, type: "success" });
      document.getElementById("btnCerrar").click();
      getProveedores();

      setIsSubmitting(true)

      if (metodo === "POST") {
        show_alerta({ message: "Proveedor creado con éxito", type: "success" });
      } else if (metodo === "PUT") {
        show_alerta({
          message: "Proveedor actualizado con éxito",
          type: "success",
        });
      } else if (metodo === "DELETE") {
        show_alerta({
          message: "Proveedor eliminado con éxito",
          type: "success",
        });
      }
    } catch (error) {
      if (error.response) {
        show_alerta({ message: error.response.data.message, type: "error" });
      } else if (error.request) {
        show_alerta({ message: "Error en la solicitud", type: "error" });
      } else {
        show_alerta({ message: "Error desconocido", type: "error" });
      }
      console.log(error);
    }finally {
      setIsSubmitting(false)
    }
  };

  const deleteProveedor = async (IdProveedor, NombreApellido) => {
    // Verificar si el proveedor está asociado a alguna compra
    const asociado = await getComprasByProveedor(IdProveedor);

    if (asociado) {
      // Mostrar mensaje si está asociado y no permitir la eliminación
      show_alerta({
        message:
          "El proveedor está asociado a una compra y no puede ser eliminado.",
        type: "info",
      });
      return; // Salir de la función para evitar la eliminación
    }

    // Confirmar la eliminación del proveedor
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro de eliminar al proveedor ${NombreApellido}?`,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceder con la eliminación del proveedor
        enviarSolicitud("DELETE", { IdProveedor }).then(() => {
          // Actualizar la lista de proveedores después de eliminar
          getProveedores();

          // Calcular la nueva página después de la eliminación
          const newPage =
            Math.ceil((filteredProveedores.length - 1) / itemsPerPage) || 1;
          setCurrentPage(newPage);

          show_alerta({
            message: "Proveedor eliminado con éxito",
            type: "success",
          });
        });
      } else {
        show_alerta({ message: "El proveedor NO fue eliminado", type: "info" });
      }
    });
  };

  const cambiarEstadoProveedor = async (IdProveedor) => {
    try {
      const proveedor = Proveedores.find(
        (proveedor) => proveedor.IdProveedor === IdProveedor
      );
      const nuevoEstado = proveedor.Estado === "Activo" ? "Inactivo" : "Activo";

      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: `¿Seguro de cambiar el estado del proveedor ${proveedor.NombreApellido}?`,
        icon: "question",
        html: `El estado actual del proveedor es: <strong> ${proveedor.Estado}</strong>. ¿Desea cambiarlo a ${nuevoEstado}?`,
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar estado",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.put(`${url}/${IdProveedor}`, { Estado: nuevoEstado });

          setProveedores((prevProveedores) =>
            prevProveedores.map((proveedor) =>
              proveedor.IdProveedor === IdProveedor
                ? { ...proveedor, Estado: nuevoEstado }
                : proveedor
            )
          );

          show_alerta({
            message: "Estado del proveedor cambiado con éxito",
            type: "success",
          });
        } else {
          show_alerta({
            message: "No se ha cambiado el estado del proveedor",
            type: "info",
          });
        }
      });
    } catch (error) {
      console.error("Error updating state:", error);
      show_alerta({
        message: "Error cambiando el estado del proveedor",
        type: "error",
      });
    }
  };

  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Resetear la página actual al cambiar el término de búsqueda
  };

  // Filtrar los proveedores según el término de búsqueda
  const filteredProveedores = Proveedores.filter((proveedor) =>
    Object.values(proveedor).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Aplicar paginación a los proveedores filtrados
  const totalPages = Math.ceil(filteredProveedores.length / itemsPerPage);
  const currentProveedores = filteredProveedores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div
        className="modal fade"
        id="modalProveedor"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalProveedorLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-lg" role="document">
          {/* Cambiado a modal-lg para un modal más ancho */}
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalProveedorLabel">
                {title}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form id="crearProveedorForm">
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="tipoDocumentoProveedor">
                      Tipo de Documento:
                    </label>
                    <select
                      className="form-control"
                      id="tipoDocumentoProveedor"
                      value={TipoDocumento}
                      onChange={(e) => handleChangeTipoDocumento(e)}
                      required
                    >
                      <option disabled value="">Seleccione un tipo de documento</option>
                      <option value="CC">Cédula</option>
                      <option value="CE">Cédula de Extranjería</option>
                      <option value="NIT">NIT</option>
                    </select>
                    {TipoDocumento === "" && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        Este campo es obligatorio.
                      </div>
                    )}
                  </div>

                  <div className="form-group col-md-6">
                    <label htmlFor="nroDocumentoProveedor">
                      Número de documento
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.nroDocumento ? "is-invalid" : ""
                      }`}
                      id="nroDocumentoProveedor"
                      placeholder="Ingrese el número de documento"
                      required
                      value={NroDocumento}
                      onChange={handleChangeNroDocumento}
                    />
                    {renderErrorMessage(errors.nroDocumento)}
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="nombreProveedor">
                      {NombreApellidoLabel}
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.nombreApellido ? "is-invalid" : ""
                      }`}
                      id="nombreProveedor"
                      placeholder={`Ingrese ${NombreApellidoLabel.toLowerCase()}`}
                      required
                      value={NombreApellido}
                      onChange={handleChangeNombreApellido}
                    />
                    {renderErrorMessage(errors.nombreApellido)}
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="contactoProveedor">Contacto</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.contacto ? "is-invalid" : ""
                      }`}
                      id="contactoProveedor"
                      placeholder="Ingrese el contacto"
                      value={Contacto}
                      onChange={handleChangeContacto}
                      disabled={
                        TipoDocumento === "CC" || TipoDocumento === "CE"
                      }
                    />
                    {renderErrorMessage(errors.contacto)}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="telefonoProveedor">Teléfono</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.telefono ? "is-invalid" : ""
                      }`}
                      id="telefonoProveedor"
                      placeholder="Ingrese el teléfono"
                      required
                      value={Telefono}
                      onChange={handleChangeTelefono}
                    />
                    {renderErrorMessage(errors.telefono)}
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="direccionCliente">Dirección</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.direccion ? "is-invalid" : ""
                      }`}
                      id="direccionCliente"
                      placeholder="Ingrese la dirección"
                      required
                      value={Direccion}
                      onChange={handleChangeDireccion}
                    />
                    {renderErrorMessage(errors.direccion)}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-12">
                    <label htmlFor="correoProveedor">Correo electrónico</label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.correo ? "is-invalid" : ""
                      }`}
                      id="correoProveedor"
                      placeholder="Ingrese el correo Electrónico"
                      required
                      value={Correo}
                      onChange={handleChangeCorreo}
                    />
                    {renderErrorMessage(errors.correo)}
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                id="btnCerrar"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  guardarProveedor();
                }}
                disabled={isSubmitting}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Fin modal crear/actualizar proveedor --> */}

      {/* Botón para abrir el modal de crear proveedor */}
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between">
          {/* <h1 className="h3 mb-3 text-center text-dark">
            Gestión de Proveedores
          </h1> */}
        </div>

        {/* <!-- Tabla Proveedores --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-1 d-flex justify-content-between align-items-center">
            <SearchBar
              searchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
            />
            <button
              type="button"
              className="btn btn-dark d-flex align-items-center justify-content-center p-0"
              data-toggle="modal"
              data-target="#modalProveedor"
              style={{
                width: "165px",
                height: "40px",
              }}
              onClick={() => openModal(1, "", "", "", "", "", "", "", "")}
            >
              <i className="fas fa-pencil-alt"></i>
              <span className="d-none d-sm-inline ml-2">Crear Proveedor</span>
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table
                className="table table-bordered"
                id="dataTable"
                width="100%"
                cellSpacing="0"
              >
                <thead>
                  <tr>
                    <th>Tipo de Documento</th>
                    <th>N°Documento</th>
                    <th>Proveedor</th>
                    <th>Contacto</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Correo Electrónico</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProveedores.map((proveedor) => (
                    <tr key={proveedor.NroDocumento}>
                      <td>{proveedor.TipoDocumento}</td>
                      <td>{proveedor.NroDocumento}</td>
                      <td>{proveedor.NombreApellido}</td>
                      <td>{proveedor.Contacto}</td>
                      <td>{proveedor.Telefono}</td>
                      <td>{proveedor.Direccion}</td>
                      <td>{proveedor.Correo}</td>
                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={proveedor.Estado === "Activo"}
                            onChange={() =>
                              cambiarEstadoProveedor(proveedor.IdProveedor)
                            }
                            className={
                              proveedor.Estado === "Activo"
                                ? "switch-green"
                                : "switch-red"
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                      </td>
                      <td>
                        <div className="d-flex">
                          <button
                            className="btn btn-warning btn-sm mr-1"
                            title="Editar"
                            data-toggle="modal"
                            data-target="#modalProveedor"
                            onClick={() => openModal(2, proveedor)}
                            disabled={proveedor.Estado !== "Activo"}
                          >
                            <i className="fas fa-sync-alt"></i>
                          </button>
                          <button
                            className="btn btn-danger btn-sm mr"
                            title="Eliminar"
                            onClick={() =>
                              deleteProveedor(
                                proveedor.IdProveedor,
                                proveedor.NombreApellido
                              )
                            }
                            disabled={proveedor.Estado !== "Activo"}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
        {/* Fin tabla proveedores */}
      </div>
      <AdminFooter />
    </>
  );
};
