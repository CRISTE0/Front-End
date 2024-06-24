import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Pagination from "../../assets/js/Pagination";
import SearchBar from "../../assets/js/SearchBar";
import imagenesAdmin from "../../assets/img/imagenesAdmin";
import { subirImageDesign, subirImageDesignAdmin, subirImageReference } from "../../firebase/config";
import withReactContent from "sweetalert2-react-content";

export const Disenios = () => {
  const url = "http://localhost:3000/api/disenios";
  const [Disenios, setDisenios] = useState([]);
  const [IdDisenio, setIdDisenio] = useState("");
  const [NombreDisenio, setNombreDisenio] = useState("");
  const [Fuente, setFuente] = useState("");
  const [TamanioFuente, setTamanioFuente] = useState("");
  const [ColorFuente, setColorFuente] = useState("");
  const [PosicionFuente, setPosicionFuente] = useState("");
  const [PosicionImagen, setPosicionImagen] = useState("");
  const [ImagenDisenio, setImagenDisenio] = useState("");
  const [ImagenReferencia, setImagenReferencia] = useState("");
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({
    NombreDisenio:"",
    Fuente:"",
    TamanioFuente: "",
    ColorFuente: "",
    PosicionFuente: "",
    PosicionImagen: "",
    ImagenDisenio: "",
    ImagenReferencia:""
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    getDisenios();
  }, []);

  const getDisenios = async () => {
    const respuesta = await axios.get(url);
    setDisenios(respuesta.data);
    console.log(respuesta.data);
  };

  const [showInputsFile,setShowInputsFile] = useState(null);

  const [showSavedImages,setShowSavedImages] = useState(null);

  const openModal = (op, disenio = null) => {
    if (op === 1) {
      // Crear diseño
      setIdDisenio("");
      setNombreDisenio("");
      setFuente("");
      setTamanioFuente("");
      setColorFuente("");
      setPosicionFuente("");
      setPosicionImagen("");
      setImagenDisenio("");
      setImagenReferencia("");
      setOperation(1);
      setTitle("Crear Diseño");
      setShowInputsFile(true);
      
    } else if (op === 2 && disenio) {
      // Actualizar diseño
      setIdDisenio(disenio.IdDisenio);
      setNombreDisenio(disenio.NombreDisenio);
      setFuente(disenio.Fuente);
      setTamanioFuente(disenio.TamanioFuente);
      setColorFuente(disenio.ColorFuente);
      setPosicionFuente(disenio.PosicionFuente);
      setPosicionImagen(disenio.PosicionImagen);
      setImagenDisenio(disenio.ImagenDisenio);
      setImagenReferencia(disenio.ImagenReferencia);

      setShowInputsFile(false);
      setOperation(2);
      setTitle("Actualizar Datos");
      setErrors({
        NombreDisenio: "",
        Fuente: "",
        TamanioFuente: "",
        ColorFuente: "",
        PosicionFuente: "",
        PosicionImagen: "",
      });
      const errors = {
        NombreDisenio: validateTamanioFuente(disenio.NombreDisenio),
        Fuente: validateTamanioFuente(disenio.Fuente),

        TamanioFuente: validateTamanioFuente(disenio.TamanioFuente),
        ColorFuente: validateColorFuente(disenio.ColorFuente),
        PosicionFuente: validatePosicionFuente(disenio.PosicionFuente),
        PosicionImagen: validatePosicionImagen(disenio.PosicionImagen),
      };
      setErrors(errors);
    }
  };

  const guardarDisenio = async () => {
    
    // const cleanedColorFuente = ColorFuente.trim().replace(/\s+/g, " "); // Elimina los espacios múltiples y los extremos
    // const cleanedPosicionImagen = PosicionImagen.trim().replace(/\s+/g, " "); // Elimina los espacios múltiples y los extremos
    
    if (operation === 1) {
      
      const ulrDesign= await subirImageDesignAdmin(ImagenDisenio);
      const ulrReference= await subirImageReference(ImagenReferencia);

      // Enviar los datos
      await enviarSolicitud("POST", {
        NombreDisenio,
        Fuente,
        TamanioFuente,
        ColorFuente,
        PosicionFuente,
        PosicionImagen,
        ImagenDisenio:ulrDesign,
        ImagenReferencia:ulrReference,
        Estado: "Activo",
      });
    } else if (operation === 2) {
      // Actualizar Cliente
      await enviarSolicitud("PUT", {
        IdDisenio,
        NombreDisenio,
        Fuente,
        TamanioFuente,
        ColorFuente,
        PosicionFuente,
        PosicionImagen,
        ImagenDisenio,
        ImagenReferencia,
        
        // Fuente,
        // TamanioFuente,
        // ColorFuente: cleanedColorFuente,
        // PosicionFuente,
        // PosicionImagen: cleanedPosicionImagen,
        // ImagenDisenio,
      });
    }
  };

  const validateNombreDisenio = (value) => {
    if (!value) {
      return "Escribe el nombre del diseño";
    }
    if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ0-9]+( [A-Za-zñÑáéíóúÁÉÍÓÚ0-9]+)*$/.test(value)) {
      return "El nombre del diseño solo puede contener letras, tildes, la letra 'ñ' y números con un solo espacio entre palabras";
    }
    return "";
  };

  const validateFuente = (value) => {
    if (!value) {
      return "Escribe el nombre de la fuente";
    }
    if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ]+( [A-Za-zñÑáéíóúÁÉÍÓÚ]+)*$/.test(value)) {
      return "El nombre de la fuente solo puede contener letras, tildes y la letra 'ñ' con un solo espacio entre palabras";
    }
    return "";
  };

  // Función para validar el número de documento
  const validateTamanioFuente = (value) => {

    if (!value) {
      return "Escribe el tamaño de la fuente";
    }
    if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ0-9]+( [A-Za-zñÑáéíóúÁÉÍÓÚ0-9]+)*$/.test(value)) {
      return "El tamaño de la fuente solo puede contener letras, tildes, la letra 'ñ' y numeros con un solo espacio entre palabras";
    }
    return "";


    // if (!value) {
    //   return "Escribe el tamaño de la fuente";
    // }
    // if (!/^\d+$/.test(value)) {
    //   return "El tamaño de la fuente solo puede contener dígitos";
    // }
    // if (value.length < 6 || value.length > 10) {
    //   return "El tamaño de la fuente debe tener entre 1 y 2 dígitos";
    // }
    // return "";

    
  };

  // todavia no
  const validateColorFuente = (value) => {
    if (!value) {
      return "Escribe el color de la fuente";
    }
    if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ0-9]+( [A-Za-zñÑáéíóúÁÉÍÓÚ0-9]+)*$/.test(value)) {
      return "El color de la fuente solo puede contener letras, tildes, la letra 'ñ' y numeros con un solo espacio entre palabras";
    }
    return "";
  };

  // Función para validar el teléfono
  const validatePosicionFuente = (value) => {
    if (!value) {
      return "Escribe la";
    }
    if (!/^\d+$/.test(value)) {
      return "El teléfono solo puede contener dígitos";
    }
    if (value.length !== 10) {
      return "El teléfono debe tener exactamente 10 dígitos";
    }
    return "";
  };

  // Función para validar la dirección
  const validatePosicionImagen = (value) => {
    if (!value) {
      return "Escribe la dirección";
    }
    if (!/^[a-zA-Z0-9#-\s]*$/.test(value)) {
      return "La dirección solo puede contener letras, números, # y -";
    }
    // if (!/^[a-zA-Z0-9#-\s]*$/.test(value)) {
    //   return "El nombre y apellido solo puede contener letras, tildes y la letra 'ñ' con un solo espacio entre palabras";
    // }
    return "";
  };

  // Función para validar el ImagenDisenio electrónico
  const validateImagenDisenio = (value) => {
    if (!value) {
      return "Ingresa tu ImagenDisenio electrónico";
    }
    // Expresión regular para validar ImagenDisenio electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Ingresa un ImagenDisenio electrónico válido";
    }
    return "";
  };
  


  // Función para manejar cambios en el nombre de diseño
  const handleChangeNombreDisenio = (e) => {
    let value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio
    

    // Limitar la longitud del valor ingresado a entre 6 y 10 caracteres
    // if (value.length > 10) {
    //   value = value.slice(0, 10);
    // }
    setNombreDisenio(value);
    const errorMessage = validateNombreDisenio(value);
    setErrors((prevState) => ({
      ...prevState,
      NombreDisenio: errorMessage,
    }));
  };

  // Función para manejar cambios en la fuente
  const handleChangeFuente = (e) => {
    const value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio

    // Limitar la longitud del valor ingresado a entre 6 y 10 caracteres
    // if (value.length > 10) {
    //   value = value.slice(0, 10);
    // }
    setFuente(value);

    const errorMessage = validateFuente(value);
    setErrors((prevState) => ({
      ...prevState,
      Fuente: errorMessage,
    }));
  };
  
  // Función para manejar cambios en el número de documento
    const handleChangeTamanioFuente = (e) => {
    const value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio
    setTamanioFuente(value);

    // Validar el nombre y apellido
    const errorMessage = validateTamanioFuente(value);
    setErrors((prevState) => ({
      ...prevState,
      TamanioFuente: errorMessage,
    }));
  };
  
  // Función para manejar cambios en el color de la fuente
  const handleChangeColorFuente = (e) => {
    const value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio
    setColorFuente(value);

    // Validar el nombre y apellido
    const errorMessage = validateColorFuente(value);
    setErrors((prevState) => ({
      ...prevState,
      ColorFuente: errorMessage,
    }));
  };


  // Función para manejar cambios en el teléfono
  const handleChangePosicionFuente = (e) => {
    let value = e.target.value;
    // Limitar la longitud del valor ingresado a 10 caracteres
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setPosicionFuente(value);
    const errorMessage = validatePosicionFuente(value);
    setErrors((prevState) => ({
      ...prevState,
      PosicionFuente: errorMessage,
    }));
  };

  // Función para manejar cambios en el número de documento
  const handleChangePosicionImagen = (e) => {
    const value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio
    setPosicionImagen(value);

    // Validar la dirección
    const errorMessage = validatePosicionImagen(value);
    setErrors((prevState) => ({
      ...prevState,
      PosicionImagen: errorMessage,
    }));
  };


  // cargar la imagen que se usara en el diseño
  const handleChangeImagenDisenio = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenDisenio(reader.result);
      };
      reader.readAsDataURL(file);
    }else{
      setImagenDisenio(null);

    }
  };

    // cargar la imagen que se usara en la imagen de referencia
    const handleChangeImagenReferencia = (e) => {
      const file = e.target.files[0];
      console.log(file);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagenReferencia(reader.result);
        };
        reader.readAsDataURL(file);
      }else{
        setImagenReferencia(null)
      }
    };


  // Función para manejar cambios en el ImagenDisenio 
  // const handleChangeImagenDisenio = (e) => {
  //   const value = e.target.value;
  //   setImagenDisenio(value);
  //   const errorMessage = validateImagenDisenio(value);
  //   setErrors((prevState) => ({
  //     ...prevState,
  //     ImagenDisenio: errorMessage,
  //   }));
  // };

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

  // Función para renderizar los mensajes de error
  const renderErrorMessage = (errorMessage) => {
    return errorMessage ? (
      <div className="invalid-feedback">{errorMessage}</div>
    ) : null;
  };

  const enviarSolicitud = async (metodo, parametros) => {
    let urlRequest =
      metodo === "PUT" || metodo === "DELETE"
        ? `${url}/${parametros.IdDisenio}`
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
      getDisenios();
      if (metodo === "POST") {
        show_alerta("Diseño creado con éxito", "success", { timer: 2000 });
      } else if (metodo === "PUT") {
        show_alerta("Diseño actualizado con éxito", "success", {
          timer: 2000,
        });
      } else if (metodo === "DELETE") {
        show_alerta("Diseño eliminado con éxito", "success", { timer: 2000 });
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

  const deleteDisenio = (IdDisenio, NombreDisenio) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro de eliminar el diseño ${NombreDisenio}?`,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        enviarSolicitud("DELETE", { IdDisenio: IdDisenio }).then(() => {
          // Calcular el índice del cliente eliminado en la lista filtrada
          const index = filteredDisenios.findIndex(
            (disenio) => disenio.IdDisenio === IdDisenio
          );

          // Determinar la página en la que debería estar el cliente después de la eliminación
          const newPage =
            Math.ceil((filteredDisenios.length - 1) / itemsPerPage) || 1;

          // Establecer la nueva página como la página actual
          setCurrentPage(newPage);
        });
      } else {
        show_alerta("El diseño NO fue eliminado", "info");
      }
    });
  };

  const cambiarEstadoDisenio = async (IdDisenio) => {
    try {
      const disenio = Disenios.find(
        (disenio) => disenio.IdDisenio === IdDisenio
      );
      const nuevoEstado = disenio.Estado === "Activo" ? "Inactivo" : "Activo";

      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: `¿Seguro de cambiar el estado del diseño ${disenio.NombreDisenio}?`,
        icon: "question",
        html: `El estado actual del diseño es: <strong> ${disenio.Estado}</strong>. ¿Desea cambiarlo a ${nuevoEstado}?`,
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar estado",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.put(`${url}/${IdDisenio}`, { Estado: nuevoEstado });

          setDisenios((prevDisenios) =>
            prevDisenios.map((disenio) =>
              disenio.IdDisenio === IdDisenio
                ? { ...disenio, Estado: nuevoEstado }
                : disenio
            )
          );

          show_alerta("Estado del diseño cambiado con éxito", "success", {
            timer: 2000,
          });
        } else {
          show_alerta("No se ha cambiado el estado del diseño", "info");
        }
      });
    } catch (error) {
      console.error("Error updating state:", error);
      show_alerta("Error cambiando el estado del diseño", "error");
    }
  };

  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Resetear la página actual al cambiar el término de búsqueda
  };

  // Filtrar los Disenios según el término de búsqueda
  const filteredDisenios = Disenios.filter((cliente) =>
    Object.values(cliente).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Aplicar paginación a los Disenios filtrados
  const totalPages = Math.ceil(filteredDisenios.length / itemsPerPage);
  const currentDiseños = filteredDisenios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* modal diseño */}
      <div
        className="modal fade"
        id="modalDisenio"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalClienteLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalClienteLabel">
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
              <form id="crearClienteForm">
                <div className="form-row">

                {/* Nombre de diseño */}
                <div className="form-group col-md-6">
                    <label htmlFor="nombreDiseño">Nombre del Diseño:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.NombreDisenio ? "is-invalid" : ""
                      }`}
                      id="nombreDiseño"
                      placeholder="Ingrese el nombre del diseño"
                      required
                      value={NombreDisenio}
                      onChange={handleChangeNombreDisenio}
                    />
                    {renderErrorMessage(errors.NombreDisenio)}
                  </div>

                  {/* Nombre de fuente*/}
                  <div className="form-group col-md-6">
                    <label htmlFor="Fuente">Fuente:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.Fuente ? "is-invalid" : ""
                      }`}
                      id="Fuente"
                      placeholder="Ingrese el nombre de la fuente"
                      required
                      value={Fuente}
                      onChange={handleChangeFuente}
                    />
                    {renderErrorMessage(errors.Fuente)}
                  </div>

                  {/* Tamaño de fuente*/}
                  <div className="form-group col-md-6">
                    <label htmlFor="TamanioFuente">
                      Tamaño de Fuente:
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.TamanioFuente ? "is-invalid" : ""
                      }`}
                      id="TamanioFuente"
                      placeholder="Ingrese el tamaño de la fuente"
                      required
                      value={TamanioFuente}
                      onChange={handleChangeTamanioFuente}
                    />
                    {renderErrorMessage(errors.TamanioFuente)}
                    
                  </div>


                  {/* Color de fuente*/}
                  <div className="form-group col-md-6">
                    <label htmlFor="colorFuente">Color de Fuente:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.ColorFuente ? "is-invalid" : ""
                      }`}
                      id="colorFuente"
                      placeholder="Ingrese el color de la fuente"
                      required
                      value={ColorFuente}
                      onChange={handleChangeColorFuente}
                    />
                    {renderErrorMessage(errors.ColorFuente)}
                  </div>


                  {/* Posicion de fuente*/}
                  <div className="form-group col-md-6">
                    <label htmlFor="PosicionFuente">
                      Posicion de Fuente:
                    </label>
                    <select
                      className="form-control"
                      id="PosicionFuente"
                      value={PosicionFuente}
                      onChange={(e) => handleChangePosicionFuente(e)}
                      required
                      // defaultValue={""}
                    >
                      <option value="" disabled>Seleccione una posición para la fuente</option>
                      <option value="Arriba Izquierda">Arriba Izquierda</option>
                      <option value="Arriba Derecha">Arriba Derecha</option>
                      <option value="Abajo Izquierda">Abajo Izquierda</option>
                      <option value="Abajo Derecha">Abajo Derecha</option>
                      <option value="Centro">Centro</option>
                      <option value="No aplica">No aplica</option>
                    </select>

                    {PosicionFuente === "" && (
                      <p className="text-danger">
                        Por favor, seleccione una posición para la fuente.
                      </p>
                    )}
                  </div>
                

                  {/* Posicion de imagen*/}
                  <div className="form-group col-md-6">
                    <label htmlFor="PosicionImagen">
                      Posicion de Imagen:
                    </label>
                    <select
                      className="form-control"
                      id="PosicionImagen"
                      value={PosicionImagen}
                      onChange={(e) => handleChangePosicionImagen(e)}
                      required
                    >
                      <option value="" disabled>Seleccione una posición para la imagen</option>
                      <option value="Arriba Izquierda">Arriba Izquierda</option>
                      <option value="Arriba Derecha">Arriba Derecha</option>
                      <option value="Abajo Izquierda">Abajo Izquierda</option>
                      <option value="Abajo Derecha">Abajo Derecha</option>
                      <option value="Centro">Centro</option>
                      <option value="No aplica">No aplica</option>

                    </select>

                    {PosicionImagen === "" && (
                      <p className="text-danger">
                        Por favor, seleccione una posición para la imagen.
                      </p>
                    )}
                  </div>


                  {/* Imagen diseño*/}
                  <div className="form-group col-md-6">
                    <label htmlFor="ImagenDisenio">Imagen Diseño :</label>

                    {showInputsFile && (
                    <input
                      type="file"
                      className={`form-control ${
                        errors.ImagenDisenio ? "is-invalid" : ""
                      }`}
                      id="ImagenDisenio"
                      onChange={handleChangeImagenDisenio}
                      required
                      
                      // onChange={handleChangeImagenDisenio}
                    />
                    )}

                    {renderErrorMessage(errors.ImagenDisenio)}

                    <div className="container py-5 mx-5">
                    {ImagenDisenio && (
                    <img
                      src={ImagenDisenio}
                      alt="Vista previa imagen del diseño"
                      style={{ maxWidth: '200px', display: 'block', border: "1px solid black"}}
                    />
                    )}
                    </div>
                  </div>



                  {/* Imagen referencia*/}
                  <div className="form-group col-md-6">
                    <label htmlFor="ImagenDisenioCliente">Imagen Referencia :</label>

                    {showInputsFile && (
                    <input
                      type="file"
                      className={`form-control ${
                        errors.ImagenReferencia ? "is-invalid" : ""
                      }`}
                      id="ImagenDisenioCliente"
                      onChange={handleChangeImagenReferencia}
                      required
                      
                      // onChange={handleChangeImagenDisenio}
                    />
                    )}

                    {renderErrorMessage(errors.ImagenReferencia)}

                    <div className="container py-5 mx-5">
                    {ImagenReferencia && (
                    <img
                      src={ImagenReferencia}
                      alt="Vista previa imagen del diseño"
                      style={{ maxWidth: '200px', display: 'block', border: "1px solid black"}}
                    />
                    )}
                    </div>
                  </div>
                  
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                id="btnCerrarCliente"
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  guardarDisenio();
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* modal diseño */}

      <div className="container-fluid">
        {/* <!-- Page Heading --> */}
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="h3 mb-4 text-center text-dark">Diseños</h1>
          <div className="text-right">
            <button
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#modalDisenio"
              onClick={() => openModal(1, "", "", "", "", "", "")}
            >
              <i className="fas fa-pencil-alt"></i> Crear Diseño
            </button>
          </div>
        </div>

        {/* <!-- Tabla de diseños --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Diseños</h6>
          </div>
          <div className="card-body">
            <SearchBar
              searchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
            />
            <div className="table-responsive">
              <table
                className="table table-bordered"
                id="dataTable"
                width="100%"
                cellSpacing="0"
              >
                <thead>
                  <tr>
                    <th>Nombre del Diseño</th>
                    <th>Fuente</th>
                    <th>Tamaño de Fuente</th>
                    <th>Color de fuente</th>
                    {/* <th>Dirección</th>
                    <th>ImagenDisenio Electrónico</th> */}
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDiseños.map((disenio) => (
                    <tr key={disenio.IdDisenio}>
                      <td>{disenio.NombreDisenio}</td>
                      <td>{disenio.Fuente}</td>
                      <td>{disenio.TamanioFuente}</td>
                      <td>{disenio.ColorFuente}</td>
                      {/* <td>{cliente.PosicionImagen}</td>
                      <td>{cliente.ImagenDisenio}</td> */}

                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={disenio.Estado === "Activo"}
                            onChange={() =>
                              cambiarEstadoDisenio(disenio.IdDisenio)
                            }
                            className={
                              disenio.Estado === "Activo"
                                ? "switch-green"
                                : "switch-red"
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                      </td>
                      <td>
                        <div
                          className="btn-group"
                          role="group"
                          aria-label="Acciones"
                        >
                          <button
                            className="btn btn-warning btn-sm mr-2"
                            title="Actualizar"
                            data-toggle="modal"
                            data-target="#modalDisenio"
                            onClick={() => openModal(2, disenio)}
                            disabled={disenio.Estado != "Activo"}
                          >
                            <i className="fas fa-sync-alt"></i>
                          </button>
                          <button
                            className="btn btn-danger btn-sm mr-2"
                            onClick={() =>
                              deleteDisenio(
                                disenio.IdDisenio,
                                disenio.NombreDisenio
                              )
                            }
                            disabled={disenio.Estado != "Activo"}
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
        {/* Fin tabla de diseños */}
      </div>

      {/* <!-- camisas añadidas por los Usuarios --> */}
      {/* //nepe */}
      {/* <div className="container-fluid">
      <h3 className="text-dark">Diseños de @username</h3>
      <div className="row">
        <div className="col-md-3">
          <div className="card mb-4 product-wap rounded-0">
            <div className="card rounded-0">
              <img
                className="card-img rounded-0 img-fluid"
                src={imagenesAdmin[0]}
                alt="Diseño #1"
              />
            </div>
            <div className="card-body">
              <p className="text-dark mb-0">Diseño #1</p>
              <div className="d-flex justify-content-between mt-3">
                <button type="button" className="btn btn-danger">
                  <i className="fas fa-trash"></i> Eliminar
                </button>
                <button type="button" className="btn btn-primary ml-2">
                  <i className="fas fa-shopping-cart"></i> Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
        
        </div>
      </div>
      */}
    </>
  );
};
