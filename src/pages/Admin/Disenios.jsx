import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Pagination from "../../assets/js/Pagination";
import SearchBar from "../../assets/js/SearchBar";
import imagenesAdmin from "../../assets/img/imagenesAdmin";
import {
  editImageDesign,
  editImageReference,
  subirImageDesign,
  subirImageDesignAdmin,
  subirImageReference,
} from "../../firebase/config";
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
  const [TamanioImagen, setTamanioImagen] = useState("");
  const [PosicionImagen, setPosicionImagen] = useState("");
  const [PrecioDisenio, setPrecioDisenio] = useState("");
  const [ImagenDisenio, setImagenDisenio] = useState("");
  const [ImagenReferencia, setImagenReferencia] = useState("");
  const [IdImagenDisenio, setIdImagenDisenio] = useState("");
  const [IdImagenReferencia, setIdImagenReferencia] = useState("");
  const [disenioSeleccionado, setDisenioSeleccionado] = useState(null);

  let IdImagenDisenioCreate;
  let ImagenDisenioCreate;

  let IdImagenDisenioUpdate;
  let ImagenDisenioUpdate;

  // variables temporales de para el modal de actualizar diseño

  const [FuenteTemporalEdit, setFuenteTemporalEdit] = useState("");
  const [TamanioFuenteTemporalEdit, setTamanioFuenteTemporalEdit] =
    useState("");
  const [ColorFuenteTemporalEdit, setColorFuenteTemporalEdit] = useState("");
  const [PosicionFuenteTemporalEdit, setPosicionFuenteTemporalEdit] =
    useState("");

  const [TamanioImagenTemporalEdit, setTamanioImagenTemporalEdit] =
    useState("");
  const [PosicionImagenTemporalEdit, setPosicionImagenTemporalEdit] =
    useState("");
  const [ImagenDisenioTemporalEdit, setImagenDisenioTemporalEdit] =
    useState("");
  const [ImagenReferenciaTemporalEdit, setImagenReferenciaTemporalEdit] =
    useState("");

  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({
    NombreDisenio: "",
    PrecioDisenio: "",
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

  const [showInputsFile, setShowInputsFile] = useState(null);

  const [showSavedImages, setShowSavedImages] = useState(null);

  const [showColorInput, setShowColorInput] = useState(null);
  const [showColor, setShowColor] = useState(null);

  const [showDisenio, setShowDisenio] = useState(null);
  const [showDisenioInput, setShowDisenioInput] = useState(null);

  const [showExistsColor, setShowExistsColor] = useState(null);

  const renderInputDisenio =
    showDisenio &&
    (operation === 1 || (operation === 2 && ImagenDisenio !== "No aplica"));

  function formatCurrency(value) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  }

  const openModal = (op, disenio) => {
    if (op === 1) {
      // Crear diseño
      setTitle("Crear Diseño");
      setOperation(1);
      setIdDisenio("");
      setNombreDisenio("");
      setFuente("");
      setTamanioFuente("");
      setColorFuente("#000000");
      setShowColorValue(false);
      setShowExistsColor(false);
      setPosicionFuente("");

      setTamanioImagen("");
      setPosicionImagen("");
      setPrecioDisenio("");
      setImagenDisenio("0");
      setImagenReferencia("0");
      setShowInputsFile(true);

      setShowDisenioInput(false);

      setShowColorInput(false);
      setShowColor(true);
      setShowDisenio(true);

      // document.getElementById("nombreFuente").selectedIndex=0;
      // document.getElementById("tamanioFuente").selectedIndex=0;
      // document.getElementById("posicionFuente").selectedIndex=0;

      const selectFuente = document.getElementById("nombreFuente");
      const selectTamanioFuente = document.getElementById("tamanioFuente");
      const selectPosicionFuente = document.getElementById("posicionFuente");

      const selectTamanioImagen = document.getElementById("tamanioImagen");
      const selectPosicionImagen = document.getElementById("posicionImagen");

      if (selectFuente.options.length === 6) {
        const nuevaOpcion1 = new Option("No aplica", "No aplica");
        const nuevaOpcion2 = new Option("No aplica", "No aplica");
        const nuevaOpcion3 = new Option("No aplica", "No aplica");

        selectFuente.add(nuevaOpcion1);
        selectTamanioFuente.add(nuevaOpcion2);
        selectPosicionFuente.add(nuevaOpcion3);
      }

      if (selectTamanioImagen.options.length == 4) {
        const nuevaOpcionSelectTamImg = new Option("No aplica", "No aplica");
        const nuevaOpcionSelectPosImg = new Option("No aplica", "No aplica");

        selectTamanioImagen.add(nuevaOpcionSelectTamImg);
        selectPosicionImagen.add(nuevaOpcionSelectPosImg);
      }

      setTimeout(() => {
        document.getElementById("spanInputFileDisenio").innerHTML =
          "Seleccionar archivo";
        document.getElementById("spanInputFileReferencia").innerHTML =
          "Seleccionar archivo";
      }, 10);

      // Opcion actualizar diseño
    } else if (op === 2 && disenio) {
      setImagenReferencia("0");

      setTitle("Actualizar Datos");
      setOperation(2);

      setIdDisenio(disenio.IdDisenio);
      setNombreDisenio(disenio.NombreDisenio);
      setFuente(disenio.Fuente);
      setTamanioFuente(disenio.TamanioFuente);
      setColorFuente(disenio.ColorFuente);
      setPosicionFuente(disenio.PosicionFuente);
      setTamanioImagen(disenio.TamanioImagen);
      setPosicionImagen(disenio.PosicionImagen);
      setPrecioDisenio(disenio.PrecioDisenio);
      setImagenDisenio(disenio.ImagenDisenio);
      setImagenReferencia(disenio.ImagenReferencia);

      setIdImagenDisenio(disenio.IdImagenDisenio);
      setIdImagenReferencia(disenio.IdImagenReferencia);

      setFuenteTemporalEdit(disenio.Fuente);
      setTamanioFuenteTemporalEdit(disenio.TamanioFuente);
      setColorFuenteTemporalEdit(disenio.ColorFuente);
      setPosicionFuenteTemporalEdit(disenio.PosicionFuente);

      setTamanioImagenTemporalEdit(disenio.TamanioImagen);
      setPosicionImagenTemporalEdit(disenio.PosicionImagen);
      setImagenDisenioTemporalEdit(disenio.ImagenDisenio);
      setImagenReferenciaTemporalEdit(disenio.ImagenReferencia);

      // console.log(IdImagenDisenio);

      setShowInputsFile(false);

      const selectPosicionImagen = document.getElementById("posicionImagen");
      const selectTamanioImagen = document.getElementById("tamanioImagen");

      const selectFuente = document.getElementById("nombreFuente");
      const selectTamanioFuente = document.getElementById("tamanioFuente");
      const selectPosicionFuente = document.getElementById("posicionFuente");

      if (disenio.Fuente === "No aplica") {
        // Si las opciones de la fuente tiene un tamaño de 6 se agregara opcs a los atributos de fuente
        if (selectFuente.options.length === 6) {
          const nuevaOpcion1 = new Option("No aplica", "No aplica");
          const nuevaOpcion2 = new Option("No aplica", "No aplica");
          const nuevaOpcion3 = new Option("No aplica", "No aplica");

          selectFuente.add(nuevaOpcion1);
          selectTamanioFuente.add(nuevaOpcion2);
          selectPosicionFuente.add(nuevaOpcion3);
        }

        selectPosicionImagen.remove(6);
        selectTamanioImagen.remove(4);
      } else {
        if (selectTamanioImagen.options.length <= 4) {
          const nuevaOpcionSelectTamImg = new Option("No aplica", "No aplica");
          const nuevaOpcionSelectPosImg = new Option("No aplica", "No aplica");

          selectTamanioImagen.add(nuevaOpcionSelectTamImg);
          selectPosicionImagen.add(nuevaOpcionSelectPosImg);
        }
      }

      if (disenio.ColorFuente !== "No aplica") {
        setShowColorInput(false);
        setShowColor(false);
        setShowExistsColor(true);
      } else {
        setShowExistsColor(false);
        setShowColor(false);
        setShowColorInput(true);
      }

      // if (disenio.TamanioFuente === "No aplica") {

      // }

      if (disenio.ImagenDisenio === "No aplica") {
        setShowDisenioInput(true);

        // Elimina las opciones de ("No aplica") de los selects de los atributos de fuente
        if (selectFuente.options.length >= 7) {
          selectFuente.remove(6);
          selectTamanioFuente.remove(4);
          selectPosicionFuente.remove(6);
        }

        if (selectTamanioImagen.options.length <= 4) {
          selectFuente.remove(6);
          selectTamanioFuente.remove(4);
          selectPosicionFuente.remove(6);

          const nuevaOpcionSelectTamImg = new Option("No aplica", "No aplica");
          const nuevaOpcionSelectPosImg = new Option("No aplica", "No aplica");

          selectTamanioImagen.add(nuevaOpcionSelectTamImg);
          selectPosicionImagen.add(nuevaOpcionSelectPosImg);
        }
      } else {
        setShowDisenioInput(false);
        setShowDisenio(true);
        setTimeout(() => {
          document.getElementById("spanInputFileDisenio").innerHTML =
            "Seleccionar archivo";
        }, 10);
      }

      // setShowColor(false);

      document.getElementById("spanInputFileReferencia").innerHTML =
        "Seleccionar archivo";

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

  const handleDetalleDisenio = async (idDisenio) => {
    try {
      const respuesta = await axios.get(
        `http://localhost:3000/api/disenios/${idDisenio}`
      );

      const disenio = respuesta.data;
      console.log("Detalle de diseño:", disenio);
      setDisenioSeleccionado(disenio);
      $("#modalDetalleDisenio").modal("show");
    } catch (error) {
      show_alerta("Error al obtener los detalles del diseño", "error");
    }
  };

  const [editDesignFile, setEditDesignFile] = useState("");
  // const [editReferenceFile,setEditReferenceFile] = useState("");

  const guardarDisenio = async () => {
    // const cleanedColorFuente = ColorFuente.trim().replace(/\s+/g, " "); // Elimina los espacios múltiples y los extremos
    // const cleanedPosicionImagen = PosicionImagen.trim().replace(/\s+/g, " "); // Elimina los espacios múltiples y los extremos

    if (NombreDisenio === "") {
      show_alerta("Se necesita un nombre para el diseño", "error");
      return;
    } else {
      console.log(Disenios.NombreDisenio);
      const existe = Disenios.some(
        (disenio) => disenio.NombreDisenio === NombreDisenio
      );

      if (existe) {
        show_alerta("Ya existe un diseño con ese nombre", "error");
        return;
      }
    }

    if (Fuente === "") {
      show_alerta("Se necesita una fuente para el diseño", "error");
      return;
    }
    if (TamanioFuente === "") {
      show_alerta("Se necesita un tamaño para la fuente", "error");
      return;
    }

    if (ColorFuente === "") {
      show_alerta("Se necesita un color para la fuente", "error");
      return;
    }

    if (PosicionFuente === "") {
      show_alerta("Se necesita una posición para la fuente", "error");
      return;
    }

    if (TamanioImagen === "") {
      show_alerta("Se necesita un tamaño para la imagen del diseño", "error");
      return;
    }

    if (PosicionImagen === "") {
      show_alerta(
        "Se necesita una posición para la imagen del diseño",
        "error"
      );
      return;
    }

    if (PrecioDisenio === "" || isNaN(PrecioDisenio) || PrecioDisenio < 0) {
      show_alerta("El precio del diseño es invalido", "error");
      return;
    }

    if (ImagenDisenio === "0" /*|| ImagenDisenio !== "No aplica"*/) {
      console.log(ImagenDisenio);
      show_alerta("Se necesita una imagen del diseño", "error");
      return;
    }

    if (ImagenReferencia === "0") {
      show_alerta("Se necesita una imagen de referencia del diseño", "error");
      return;
    }

    if (operation === 1) {
      if (ImagenDisenio !== "No aplica") {
        const [idDesign, ulrDesign] = await subirImageDesignAdmin(
          ImagenDisenio
        );

        IdImagenDisenioCreate = idDesign;
        ImagenDisenioCreate = ulrDesign;

        // setTimeout(() => {
        //   console.log("valorsitos desg");
        //   console.log(IdImagenDisenio);
        //   console.log(ImagenDisenio);

        //   console.log(`iddes${idDesign}`);
        //   console.log(`urldes${ulrDesign}`);
        // }, 1000);
      } else {
        IdImagenDisenioCreate = "No aplica";
        ImagenDisenioCreate = "No aplica";
        // setIdImagenDisenio("No aplica");
        // setImagenDisenio("No aplica");
      }

      const [ulrReference, idReference] = await subirImageReference(
        ImagenReferencia
      );

      console.log(`url Reference ${ulrReference}`);
      console.log(`id Reference ${idReference}`);

      // console.log(`idDis ${idDesign}`);
      // console.log(`idRef ${idReference}`);

      // Enviar los datos
      await enviarSolicitud("POST", {
        NombreDisenio,
        Fuente,
        TamanioFuente,
        ColorFuente,
        PosicionFuente,
        TamanioImagen,
        PosicionImagen,
        PrecioDisenio,
        IdImagenDisenio: IdImagenDisenioCreate,
        ImagenDisenio: ImagenDisenioCreate,
        IdImagenReferencia: idReference,
        ImagenReferencia: ulrReference,
        Estado: "Activo",
      });
    } else if (operation === 2) {
      let inputDisenioFile;
      // let editReferenceFile;

      if (TamanioImagen !== "No aplica") {
        inputDisenioFile = document.getElementById("inputFileDisenio").files[0];
      }

      const inputReferenciaFile = document.getElementById("inputFileReferencia")
        .files[0];

      // Actualizar imagen de diseño si existe un archivo cargado
      if (inputDisenioFile) {
        const readerDesignFile = new FileReader();
        readerDesignFile.onloadend = () => {
          setEditDesignFile(readerDesignFile.result);
          console.log(readerDesignFile.result);
        };
        readerDesignFile.readAsDataURL(inputDisenioFile);

        // Si el id de imagen diseño es "No aplica" se llamara la funcion de subirImageDesignAdmin
        if (IdImagenDisenio === "No aplica") {
          const [idImageDesign, urlDesign] = await subirImageDesignAdmin(
            ImagenDisenio
          );

          IdImagenDisenioUpdate = idImageDesign;
          ImagenDisenioUpdate = urlDesign;

          // Si ya tiene un id la imagen de diseño, se llamara a la funcion editImageDesign
        } else {
          await editImageDesign(IdImagenDisenio, ImagenDisenio);

          IdImagenDisenioUpdate = IdImagenDisenio;
          ImagenDisenioUpdate = ImagenDisenioTemporalEdit;
        }

        // setImagenDisenio(nuevaImagenDisenio);
        console.log("entro EditDis");

        //  Si no hay archivo cargado y los atributos de la imagen son "No aplica" se editaran las variables
      } else if (TamanioImagen === "No aplica") {
        IdImagenDisenioUpdate = "No aplica";
        ImagenDisenioUpdate = "No aplica";
      }

      // Actualizar imagen de referencia si existe un archivo cargado
      if (inputReferenciaFile) {
        await editImageReference(IdImagenReferencia, ImagenReferencia);

        console.log("entro EditRef");
      }

      // Actualizar Diseño
      await enviarSolicitud("PUT", {
        IdDisenio,
        NombreDisenio,
        Fuente,
        TamanioFuente,
        ColorFuente,
        PosicionFuente,
        TamanioImagen,
        PosicionImagen,
        PrecioDisenio,
        IdImagenDisenio: IdImagenDisenioUpdate,
        ImagenDisenio: ImagenDisenioUpdate,
        IdImagenReferencia,
        ImagenReferencia: ImagenReferenciaTemporalEdit,
      });

      setTimeout(() => {
        setImagenReferencia(null);
      }, 1000);
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
  };

  // Funcion para validar el color de la fuente
  const validateColorFuente = (value) => {
    if (value == "#000000") {
      return "Escribe el color de la fuente.";
    }
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
      return "El color de la fuente solo puede tener formato hexadecimal.";
    }
    return "";
  };

  // Función para validar el teléfono
  const validatePosicionFuente = (value) => {
    if (!value) {
      return "Selecciona una posición para la fuente";
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

  const validatePrecioDisenio = (value) => {
    if (!value) {
      return "Digite el precio del diseño";
    }
    if (!/^\d+(\.\d+)?$/.test(value)) {
      return "El precio del diseño solo puede contener números y decimales";
    }
    return "";
  };

  // Función para validar el ImagenDisenio
  const validateImagenDisenio = () => {
    if (!ImagenDisenio) {
      return "Ingresa una imagen para tu diseño";
    }
    return "";
  };

  // Función para validar la ImagenReferencia
  const validateImagenReferencia = () => {
    console.log("imgRef");
    return "Ingresa la imagen de referencia para tu diseño";
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

    setFuente(value);

    const errorMessage = validateFuente(value);
    setErrors((prevState) => ({
      ...prevState,
      Fuente: errorMessage,
    }));

    const selectPosicionImagen = document.getElementById("posicionImagen");
    const selectTamanioImagen = document.getElementById("tamanioImagen");

    if (e.target.value === "No aplica") {
      console.log("ChangeFuente if (no aplica)");

      document.getElementById("tamanioFuente").selectedIndex = 4;
      document.getElementById("posicionFuente").selectedIndex = 4;
      setTamanioFuente("No aplica");
      setPosicionFuente("No aplica");

      selectTamanioImagen.remove(4);
      selectPosicionImagen.remove(6);

      if (operation == 2) {
        console.log(`valor de showcolor ${showColor}`);
        console.log(`valor de showcolorinput ${showColorInput}`);

        if (showExistsColor) {
          console.log("Entro showExistsColor");
          setShowExistsColor(false);
          setShowColorInput(true);
          setColorFuente("No aplica");
        } else if (FuenteTemporalEdit === "No aplica") {
          setShowColor(false);
          setShowColorInput(true);
          setColorFuente("No aplica");
        }
      } else if (operation == 1) {
        console.log(`valor de showcolor ${showColor} (operation1)`);

        setColorFuente("No aplica");
        setShowColor(false);
        setShowColorInput(true);
      }
    } else {
      if (selectPosicionImagen.options.length <= 6) {
        console.log("ChangeFuente else if (selectPosicionImagen.options < 6)");
        const nuevaOpcionSelectPosImg = new Option("No aplica", "No aplica");
        const nuevaOpcionSelectTamImg = new Option("No aplica", "No aplica");
        selectTamanioImagen.add(nuevaOpcionSelectTamImg);
        selectPosicionImagen.add(nuevaOpcionSelectPosImg);
        // document.getElementById("tamanioFuente").selectedIndex=0;
        // document.getElementById("posicionFuente").selectedIndex=0;

        if (operation == 1) {
          setTamanioFuente("");
          setPosicionFuente("");
          setColorFuente("#000000");
          setShowColorInput(false);
          setShowColor(true);
        } else if (operation == 2 && FuenteTemporalEdit !== "No aplica") {
          console.log("elseFuenteOperation2");
          console.log(FuenteTemporalEdit);

          setTamanioFuente(TamanioFuenteTemporalEdit);
          setPosicionFuente(PosicionFuenteTemporalEdit);
          setColorFuente(ColorFuenteTemporalEdit);
          setShowColorInput(false);
          setShowExistsColor(true);
        } else if (operation == 2 && FuenteTemporalEdit === "No aplica") {
          console.log("elseFuenteOperation2&&");
          console.log(FuenteTemporalEdit);

          setTamanioFuente("");
          setPosicionFuente("");
          setColorFuente("#000000");
          setShowColorInput(false);
          setShowColor(true);
        }
      }
    }
  };

  // Función para manejar cambios en el tamaño de la fuente
  const handleChangeTamanioFuente = (e) => {
    const value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio
    setTamanioFuente(value);

    // Validar el nombre y apellido
    const errorMessage = validateTamanioFuente(value);
    setErrors((prevState) => ({
      ...prevState,
      TamanioFuente: errorMessage,
    }));

    const selectPosicionImagen = document.getElementById("posicionImagen");

    const selectTamanioImagen = document.getElementById("tamanioImagen");

    if (e.target.value === "No aplica") {
      console.log("ChangeTamanioFuente if (no aplica)");
      setFuente("No aplica");
      setPosicionFuente("No aplica");
      setColorFuente("No aplica");
      // setShowColor(false);
      // setShowColorInput(true);

      selectTamanioImagen.remove(4);
      selectPosicionImagen.remove(6);

      if (operation == 2) {
        console.log(`valor de showcolor ${showColor}`);
        console.log(`valor de showcolorinput ${showColorInput}`);

        if (showExistsColor) {
          console.log("Entro showExistsColor");
          setShowExistsColor(false);
          setShowColorInput(true);
          setColorFuente("No aplica");
        } else if (FuenteTemporalEdit === "No aplica") {
          setShowColor(false);
          setShowColorInput(true);
          setColorFuente("No aplica");
        }
      } else if (operation == 1) {
        console.log(`valor de showcolor ${showColor} (operation1)`);

        setColorFuente("No aplica");
        setShowColor(false);
        setShowColorInput(true);
      }
    } else {
      if (selectPosicionImagen.options.length <= 6) {
        console.log("ChangeTamanioFuente else if (options < 6)");
        const nuevaOpcionSelectPosImg = new Option("No aplica", "No aplica");
        const nuevaOpcionSelectTamImg = new Option("No aplica", "No aplica");

        selectTamanioImagen.add(nuevaOpcionSelectTamImg);
        selectPosicionImagen.add(nuevaOpcionSelectPosImg);

        if (operation == 1) {
          setFuente("");
          // setFuente("");
          setPosicionFuente("");
          setColorFuente("#000000");
          setShowColorInput(false);
          setShowColor(true);
        } else if (operation == 2 && FuenteTemporalEdit !== "No aplica") {
          setFuente(FuenteTemporalEdit);
          setPosicionFuente(PosicionFuenteTemporalEdit);
          setColorFuente(ColorFuenteTemporalEdit);
          setShowColorInput(false);
          setShowExistsColor(true);
        } else if (operation == 2 && FuenteTemporalEdit === "No aplica") {
          console.log("elseFuenteOperation2&&");
          console.log(FuenteTemporalEdit);

          setFuente("");
          setPosicionFuente("");
          setColorFuente("#000000");
          setShowColorInput(false);
          setShowColor(true);
        }
      }
    }
  };

  const [colorValue, setColorValue] = useState("");

  const [showcolorValue, setShowColorValue] = useState("");

  // Función para manejar cambios en el color de la fuente
  const handleChangeColorFuente = (e) => {
    const value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio
    setColorFuente(value);

    setShowColorValue(true);

    setTimeout(() => {
      let spanValueColor = document.getElementById("spanColor");

      spanValueColor.innerHTML = value;
    }, 40);

    // Validar el nombre y apellido
    const errorMessage = validateColorFuente(value);
    setErrors((prevState) => ({
      ...prevState,
      ColorFuente: errorMessage,
    }));
  };

  // Función para manejar cambios en la posicion de la fuente
  const handleChangePosicionFuente = (e) => {
    let value = e.target.value;

    // Limitar la longitud del valor ingresado a 10 caracteres
    // if (value.length > 10) {
    //   value = value.slice(0, 10);
    // }

    setPosicionFuente(value);

    const selectTamanioImagen = document.getElementById("tamanioImagen");

    const selectPosicionImagen = document.getElementById("posicionImagen");

    if (e.target.value === "No aplica") {
      console.log("ChangePosicionFuente if (no aplica)");
      // document.getElementById("nombreFuente").selectedIndex=4;
      // document.getElementById("tamanioFuente").selectedIndex=4;
      setFuente("No aplica");
      setTamanioFuente("No aplica");
      setColorFuente("No aplica");
      // setShowColor(false);
      // setShowColorInput(true);

      selectTamanioImagen.remove(4);
      selectPosicionImagen.remove(6);

      if (operation == 2) {
        console.log(`valor de showcolor ${showColor}`);
        console.log(`valor de showcolorinput ${showColorInput}`);

        if (showExistsColor) {
          console.log("Entro showExistsColor");
          setShowExistsColor(false);
          setShowColorInput(true);
          setColorFuente("No aplica");
        } else if (FuenteTemporalEdit === "No aplica") {
          setShowColor(false);
          setShowColorInput(true);
          setColorFuente("No aplica");
        }
      } else if (operation == 1) {
        console.log(`valor de showcolor ${showColor} (operation1)`);

        setColorFuente("No aplica");
        setShowColor(false);
        setShowColorInput(true);
      }
    } else {
      if (selectPosicionImagen.options.length <= 6) {
        console.log("ChangePosicionFuente else if (options < 6)");
        const nuevaOpcionSelectPosImg = new Option("No aplica", "No aplica");
        const nuevaOpcionSelectTamImg = new Option("No aplica", "No aplica");
        selectTamanioImagen.add(nuevaOpcionSelectTamImg);
        selectPosicionImagen.add(nuevaOpcionSelectPosImg);

        // document.getElementById("nombreFuente").selectedIndex=0;
        // document.getElementById("tamanioFuente").selectedIndex=0;
        // setFuente("");
        // setTamanioFuente("");
        // setColorFuente("#000000");
        // setShowColorInput(false);
        // setShowColor(true);

        if (operation == 1) {
          setFuente("");
          setTamanioFuente("");
          setColorFuente("#000000");
          setShowColorInput(false);
          setShowColor(true);
        } else if (operation == 2 && FuenteTemporalEdit !== "No aplica") {
          setFuente(FuenteTemporalEdit);
          setTamanioFuente(TamanioFuenteTemporalEdit);
          setColorFuente(ColorFuenteTemporalEdit);
          setShowColorInput(false);
          setShowExistsColor(true);
        } else if (operation == 2 && FuenteTemporalEdit === "No aplica") {
          console.log("elseFuenteOperation2&&");
          console.log(FuenteTemporalEdit);

          setFuente("");
          setTamanioFuente("");
          setColorFuente("#000000");
          setShowColorInput(false);
          setShowColor(true);
        }
      }
    }
  };

  // Función para manejar cambios en el tamaño de la imagen
  const handleChangeTamanioImagen = (e) => {
    const value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio
    setTamanioImagen(value);

    const selectNombreFuente = document.getElementById("nombreFuente");
    const selectTamanioFuente = document.getElementById("tamanioFuente");
    const selectPosicionFuente = document.getElementById("posicionFuente");

    if (e.target.value === "No aplica") {
      console.log("ChangeTamanioImagen if (no aplica)");
      console.log("Change");
      console.log(selectNombreFuente.options.length);

      setShowDisenio(false);
      setShowDisenioInput(true);
      setImagenDisenio("No aplica");

      setPosicionImagen("No aplica");

      selectNombreFuente.remove(6);
      selectTamanioFuente.remove(4);
      selectPosicionFuente.remove(6);

      // sino es ("No aplica") pasa al else
    } else {
      console.log("ChangeTamanioFuente else");

      if (selectNombreFuente.options.length <= 6) {
        console.log(
          "ChangeTamanioFuente else if selectNombreFuente.options < 6"
        );
        const nuevaOpcion1 = new Option("No aplica", "No aplica");
        const nuevaOpcion2 = new Option("No aplica", "No aplica");
        const nuevaOpcion3 = new Option("No aplica", "No aplica");
        selectNombreFuente.add(nuevaOpcion1);
        selectTamanioFuente.add(nuevaOpcion2);
        selectPosicionFuente.add(nuevaOpcion3);

        if (operation == 1) {
          console.log("ChangeTamanioFuente else - operation create");

          setShowDisenioInput(false);
          setShowDisenio(true);
          setPosicionImagen("");
          setImagenDisenio("0");
        } else if (operation == 2) {
          console.log("ChangeTamanioFuente else - operation update");
          setShowDisenioInput(false);
          setShowDisenio(true);

          console.log(TamanioFuenteTemporalEdit);

          if (TamanioImagenTemporalEdit === "No aplica") {
            setPosicionImagen("");
            setImagenDisenio("0");
          } else {
            setPosicionImagen(PosicionImagenTemporalEdit);
            setImagenDisenio(ImagenDisenioTemporalEdit);
          }
        }

        // if (operation == 2) {
        //   setImagenDisenio("1");

        // }else if (operation == 1){
        //   setImagenDisenio("0");
        // }
      }
    }
  };

  // Función para manejar cambios en la posicion de la imagen
  const handleChangePosicionImagen = (e) => {
    const value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio
    setPosicionImagen(value);

    const selectNombreFuente = document.getElementById("nombreFuente");
    const selectTamanioFuente = document.getElementById("tamanioFuente");
    const selectPosicionFuente = document.getElementById("posicionFuente");

    if (e.target.value === "No aplica") {
      console.log("ChangePosicionImagen no aplica");
      console.log(selectNombreFuente.options.length);

      setShowDisenio(false);
      setShowDisenioInput(true);
      setImagenDisenio("No aplica");

      setTamanioImagen("No aplica");

      selectNombreFuente.remove(6);
      selectTamanioFuente.remove(4);
      selectPosicionFuente.remove(6);

      // sino es ("No aplica") pasa al else
    } else {
      console.log("ChangePosicionImagen else");

      // setTamanioImagen("");

      if (selectNombreFuente.options.length <= 6) {
        console.log("opt");
        const nuevaOpcion1 = new Option("No aplica", "No aplica");
        const nuevaOpcion2 = new Option("No aplica", "No aplica");
        const nuevaOpcion3 = new Option("No aplica", "No aplica");
        selectNombreFuente.add(nuevaOpcion1);
        selectTamanioFuente.add(nuevaOpcion2);
        selectPosicionFuente.add(nuevaOpcion3);

        if (operation == 1) {
          setShowDisenioInput(false);
          setShowDisenio(true);
          setTamanioImagen("");
          setImagenDisenio("0");
        } else if (operation == 2) {
          setShowDisenioInput(false);
          setShowDisenio(true);

          if (TamanioImagenTemporalEdit === "No aplica") {
            setTamanioImagen("");
            setImagenDisenio("0");
          } else {
            setTamanioImagen(TamanioImagenTemporalEdit);
            setImagenDisenio(ImagenDisenioTemporalEdit);
          }
        }

        // if (operation == 2) {
        //   setImagenDisenio("1");

        // }else if (operation == 1){
        //   setImagenDisenio("0");
        // }
      }
    }
  };

  // Función para manejar cambios en el precio de diseño
  const handleChangePrecioDisenio = (e) => {
    let value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio

    // Limitar la longitud del valor ingresado a entre 6 y 10 caracteres
    // if (value.length > 10) {
    //   value = value.slice(0, 10);
    // }
    setPrecioDisenio(value);
    const errorMessage = validatePrecioDisenio(value);
    setErrors((prevState) => ({
      ...prevState,
      PrecioDisenio: errorMessage,
    }));
  };

  // cargar la imagen que se usara en el diseño
  const handleChangeImagenDisenio = (e) => {
    const file = e.target.files[0];
    console.log(file);
    let spanDisenio = document.getElementById("spanInputFileDisenio");
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenDisenio(reader.result);
        console.log(reader.result);
      };
      reader.readAsDataURL(file);

      var fileName = "";
      fileName = e.target.value.split("\\").pop();

      spanDisenio.innerHTML = fileName;
    } else {
      document.getElementById("inputFileDisenio").value = null;
      setImagenDisenio("0");
      spanDisenio.innerHTML = "Seleccionar archivo";

      console.log(e.target.files[0]);
    }
  };

  // cargar la imagen que se usara en la imagen de referencia
  const handleChangeImagenReferencia = (e) => {
    const file = e.target.files[0];
    console.log(file);
    let spanReferencia = document.getElementById("spanInputFileReferencia");
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenReferencia(reader.result);
      };
      reader.readAsDataURL(file);

      var fileName = "";
      fileName = e.target.value.split("\\").pop();

      spanReferencia.innerHTML = fileName;
    } else {
      console.log("elseChanIR");

      document.getElementById("inputFileReferencia").value = null;
      setImagenReferencia("0");
      spanReferencia.innerHTML = "Seleccionar archivo";
    }
  };

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

    console.log(NombreDisenio);
    console.log(Fuente);
    console.log(TamanioFuente);
    console.log(ColorFuente);
    console.log(PosicionFuente);
    console.log(TamanioImagen);
    console.log(PosicionImagen);
    console.log(PrecioDisenio);
    console.log(ImagenDisenio);
    console.log(ImagenReferencia);

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
                    <label htmlFor="nombreFuente">Fuente:</label>
                    <select
                      className="form-control"
                      id="nombreFuente"
                      value={Fuente}
                      onChange={(e) => handleChangeFuente(e)}
                      required
                    >
                      <option value="" disabled>
                        Elige una fuente para el diseño
                      </option>
                      <option value="Palatino">Palatino</option>
                      <option value="Trebuchet MS">Trebuchet MS</option>
                      <option value="Comic Sans MS">Comic Sans</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Consolas">Consolas</option>
                      <option value="No aplica">No aplica</option>
                    </select>

                    {Fuente === "" && (
                      <p className="text-danger">
                        Por favor, seleccione una fuente para el diseño.
                      </p>
                    )}
                  </div>

                  {/* Tamaño de fuente*/}
                  <div className="form-group col-md-6">
                    <label htmlFor="tamanioFuente">Tamaño de Fuente:</label>
                    <select
                      className="form-control"
                      id="tamanioFuente"
                      value={TamanioFuente}
                      onChange={(e) => handleChangeTamanioFuente(e)}
                      required
                    >
                      <option value="" disabled>
                        Elige el tamaño de la fuente
                      </option>
                      <option value="Grande">Grande</option>
                      <option value="Mediana">Mediana</option>
                      <option value="Pequeña">Pequeña</option>
                      <option value="No aplica">No aplica</option>
                    </select>

                    {TamanioFuente === "" && (
                      <p className="text-danger">
                        Por favor, seleccione un tamaño para la fuente.
                      </p>
                    )}
                  </div>

                  {/* Color de fuente*/}
                  <div className="form-group col-md-6">
                    <label htmlFor="colorFuente">Color de Fuente:</label>

                    {showColor && (
                      <div className="d-flex align-items-center">
                        <input
                          type="color"
                          className={`form-control col-md-4 ${
                            errors.ColorFuente ? "is-invalid" : ""
                          }`}
                          id="colorFuente"
                          placeholder="Ingrese el color de la fuente"
                          required
                          value={ColorFuente}
                          onChange={handleChangeColorFuente}
                        />

                        {showcolorValue && (
                          <span className="ml-3" id="spanColor">
                            {colorValue}
                          </span>
                        )}
                      </div>
                    )}

                    {showExistsColor && (
                      <div className="d-flex align-items-center">
                        <input
                          type="color"
                          className={`form-control col-md-4 ${
                            errors.ColorFuente ? "is-invalid" : ""
                          }`}
                          id="colorFuente"
                          required
                          value={ColorFuente}
                          onChange={handleChangeColorFuente}
                        />

                        <span className="ml-3" id="spanColor">
                          {ColorFuente}
                        </span>
                      </div>
                    )}

                    {showColorInput /*|| ColorFuente === "No aplica"*/ && (
                      <input
                        type="text"
                        className="form-control"
                        disabled
                        required
                        value={"No aplica"}
                      />
                    )}

                    {ColorFuente === "#000000" && (
                      <p className="text-danger">
                        Por favor, seleccione un color para la fuente.
                      </p>
                    )}
                  </div>

                  {/* Posicion de fuente*/}
                  <div className="form-group col-md-6">
                    <label htmlFor="posicionFuente">Posicion de Fuente:</label>
                    <select
                      className="form-control"
                      id="posicionFuente"
                      value={PosicionFuente}
                      onChange={(e) => handleChangePosicionFuente(e)}
                      required
                    >
                      <option value="" disabled>
                        Seleccione una posición para la fuente
                      </option>
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

                  {/* Tamaño de imagen*/}
                  <div className="form-group col-md-6">
                    <label htmlFor="tamanioImagen">Tamaño de Imagen:</label>
                    <select
                      className="form-control"
                      id="tamanioImagen"
                      value={TamanioImagen}
                      onChange={(e) => handleChangeTamanioImagen(e)}
                      required
                    >
                      <option value="" disabled>
                        Elige el tamaño de la imagen
                      </option>
                      <option value="Grande">Grande</option>
                      <option value="Mediana">Mediana</option>
                      <option value="Pequeña">Pequeña</option>
                      <option value="No aplica">No aplica</option>
                    </select>

                    {TamanioImagen === "" && (
                      <p className="text-danger">
                        Por favor, seleccione un tamaño para la imagen.
                      </p>
                    )}
                  </div>

                  {/* Posicion de imagen*/}
                  <div className="form-group col-md-6">
                    <label htmlFor="posicionImagen">Posicion de Imagen:</label>

                    <select
                      className="form-control"
                      id="posicionImagen"
                      value={PosicionImagen}
                      onChange={(e) => handleChangePosicionImagen(e)}
                      required
                    >
                      <option value="" disabled>
                        Seleccione una posición para la imagen
                      </option>
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

                  {/* Precio de diseño */}
                  <div className="form-group col-md-6">
                    <label htmlFor="precioDiseño">Precio del Diseño:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.PrecioDisenio ? "is-invalid" : ""
                      }`}
                      id="precioDiseño"
                      placeholder="Ingrese el precio del diseño"
                      required
                      value={PrecioDisenio}
                      onChange={handleChangePrecioDisenio}
                    />
                    {renderErrorMessage(errors.PrecioDisenio)}
                  </div>

                  {/* Imagen diseño*/}
                  <div className="form-group col-md-6">
                    <label>Imagen Diseño :</label>
                    <br />

                    {renderInputDisenio && (
                      <>
                        <input
                          type="file"
                          name="file-2"
                          id="inputFileDisenio"
                          className={`inputfile inputfile-2 `}
                          onChange={handleChangeImagenDisenio}
                          draggable
                        />
                        <label htmlFor="inputFileDisenio">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="iborrainputfile"
                            width="20"
                            height="17"
                            viewBox="0 0 20 17"
                          >
                            <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
                          </svg>
                          <span
                            className="iborrainputfile"
                            id="spanInputFileDisenio"
                          >
                            Seleccionar archivo
                          </span>
                        </label>
                      </>
                    )}

                    {ImagenDisenio === "0" && (
                      <p className="text-danger">
                        Por favor, ingresa una imagen para tu diseño, se permite
                        (.png .jpg) .
                      </p>
                    )}

                    {ImagenDisenio !== "0" && ImagenDisenio !== "No aplica" && (
                      <div className="container py-5 mx-3">
                        <img
                          src={ImagenDisenio}
                          alt="Vista previa imagen del diseño"
                          style={{
                            maxWidth: "200px",
                            display: "block",
                            border: "1px solid black",
                          }}
                        />
                      </div>
                    )}

                    {showDisenioInput && (
                      <input
                        type="text"
                        className="form-control"
                        disabled
                        value={"No aplica"}
                      />
                    )}
                  </div>

                  {/* Imagen referencia*/}
                  <div className="form-group col-md-6">
                    <label htmlFor="ImagenDisenioCliente">
                      Imagen Referencia :
                    </label>

                    <br />

                    <input
                      type="file"
                      name="file-3"
                      id="inputFileReferencia"
                      className={`inputfile inputfile-2 `}
                      onChange={handleChangeImagenReferencia}
                    />
                    <label htmlFor="inputFileReferencia">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="iborrainputfile"
                        width="20"
                        height="17"
                        viewBox="0 0 20 17"
                      >
                        <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
                      </svg>
                      <span
                        className="iborrainputfile"
                        id="spanInputFileReferencia"
                      >
                        Seleccionar archivo
                      </span>
                    </label>

                    {/* {renderErrorMessage(errors.ImagenReferencia)} */}

                    {ImagenReferencia === "0" && (
                      <p className="text-danger">
                        Por favor, ingresa una imagen de referencia de tu
                        diseño, se permite (.png .jpg) .
                      </p>
                    )}

                    <div className="container py-5 mx-3">
                      {ImagenReferencia !== "0" && (
                        <img
                          src={ImagenReferencia}
                          alt="Vista previa imagen del diseño"
                          style={{
                            maxWidth: "200px",
                            display: "block",
                            border: "1px solid black",
                          }}
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

      {/* Inicio modal ver detalle diseño */}
      <div
        className="modal fade"
        id="modalDetalleDisenio"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="ModalDetalleDisenioLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalDetalleDisenioLabel">
                Detalle del diseño
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
              {disenioSeleccionado && (
                <>
                  <div className="modal-body">
                    <form>
                      <div className="form-row">
                        {/* Nombre de diseño detalle*/}
                        <div className="form-group col-md-6">
                          <label htmlFor="nombreDiseño">
                            Nombre del Diseño:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            // id="nombreDiseño"
                            value={disenioSeleccionado.NombreDisenio}
                            disabled
                          />
                        </div>

                        {/* Nombre de fuente detalle*/}
                        <div className="form-group col-md-6">
                          <label htmlFor="nombreFuente">Fuente:</label>
                          <input
                            type="text"
                            className="form-control"
                            // id="nombreDiseño"
                            value={disenioSeleccionado.Fuente}
                            disabled
                          />
                        </div>

                        {/* Tamaño de fuente detalle*/}
                        <div className="form-group col-md-6">
                          <label htmlFor="tamanioFuente">
                            Tamaño de Fuente:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            // id="nombreDiseño"
                            value={disenioSeleccionado.TamanioFuente}
                            disabled
                          />
                        </div>

                        {/* Color de fuente detalle*/}
                        <div className="form-group col-md-6">
                          <label htmlFor="colorFuente">Color de Fuente:</label>

                          {disenioSeleccionado.ColorFuente !== "No aplica" && (
                            <div className="d-flex align-items-center">
                              <input
                                type="color"
                                className="form-control col-md-4"
                                id="colorFuente"
                                value={disenioSeleccionado.ColorFuente}
                                disabled
                              />

                              <span className="ml-3" id="spanColor">
                                {disenioSeleccionado.ColorFuente}
                              </span>
                            </div>
                          )}

                          {disenioSeleccionado.ColorFuente === "No aplica" && (
                            <input
                              type="text"
                              className="form-control"
                              disabled
                              required
                              value={disenioSeleccionado.ColorFuente}
                            />
                          )}
                        </div>

                        {/* Posicion de fuente detalle*/}
                        <div className="form-group col-md-6">
                          <label htmlFor="posicionFuente">
                            Posicion de Fuente:
                          </label>

                          <input
                            type="text"
                            className="form-control"
                            // id=""
                            value={disenioSeleccionado.PosicionFuente}
                            disabled
                          />
                        </div>

                        {/* Tamaño de imagen detalle*/}
                        <div className="form-group col-md-6">
                          <label htmlFor="tamanioImagen">
                            Tamaño de Imagen:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="tamanioImagen"
                            value={disenioSeleccionado.TamanioImagen}
                            disabled
                          />
                        </div>

                        {/* Posicion de imagen detalle*/}
                        <div className="form-group col-md-6">
                          <label htmlFor="posicionImagen">
                            Posicion de Imagen:
                          </label>

                          <input
                            type="text"
                            className="form-control"
                            id="nombreDiseño"
                            value={disenioSeleccionado.PosicionImagen}
                            disabled
                          />
                        </div>

                        {/* Precio de diseño detalle*/}
                        <div className="form-group col-md-6">
                          <label htmlFor="precioDiseño">
                            Precio del Diseño:
                          </label>
                          <input
                            type="text"
                            id="precioDiseño"
                            className="form-control"
                            value={formatCurrency(
                              disenioSeleccionado.PrecioDisenio
                            )}
                            disabled
                          />
                        </div>

                        {/* Imagen diseño detalle*/}
                        <div className="form-group col-md-6">
                          <label>Imagen Diseño :</label>

                          {disenioSeleccionado.ImagenDisenio !==
                            "No aplica" && (
                            <div className="container py-4 mx-3">
                              <img
                                src={disenioSeleccionado.ImagenDisenio}
                                alt="Vista previa imagen del diseño"
                                style={{
                                  width: "170px",
                                  height: "150px",
                                  display: "block",
                                  border: "1px solid black",
                                }}
                              />
                            </div>
                          )}

                          {disenioSeleccionado.ImagenDisenio ===
                            "No aplica" && (
                            <input
                              type="text"
                              className="form-control"
                              disabled
                              value={disenioSeleccionado.ImagenDisenio}
                            />
                          )}
                        </div>

                        {/* Imagen referencia detalle*/}
                        <div className="form-group col-md-6">
                          <label>Imagen Referencia :</label>

                          <div className="container py-4 mx-3">
                            <img
                              src={disenioSeleccionado.ImagenReferencia}
                              alt="Vista previa imagen del diseño"
                              style={{
                                width: "170px",
                                height: "150px",
                                display: "block",
                                border: "1px solid black",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Fin modal ver detalle diseño */}

      <div className="container-fluid">
        {/* <!-- Page Heading --> */}
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="h3 mb-3 text-center text-dark">Gestión de Diseños</h1>
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
          <div className="card-header py-1 d-flex">
            <h6 className="m-2 font-weight-bold text-primary">Diseños</h6>
            <SearchBar
              searchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
            />
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
                      <td>
                        {disenio.ColorFuente === "No aplica" ? (
                          "No aplica"
                        ) : (
                          <div
                            style={{
                              backgroundColor: disenio.ColorFuente,
                              width: "25px",
                              height: "25px",
                              margin: "0px 0px 0px 50px",
                            }}
                          ></div>
                        )}
                      </td>
                      {/* <td>{disenio.ColorFuente}</td> */}
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
                            title="Editar"
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
                            title="Eliminar"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>

                          <button
                            className="btn btn-info btn-sm mr-2"
                            onClick={() =>
                              handleDetalleDisenio(disenio.IdDisenio)
                            }
                            disabled={disenio.Estado != "Activo"}
                            data-toggle="modal"
                            data-target="#modalDetalleDisenio"
                            title="Detalle"
                          >
                            <i className="fas fa-eye"></i>
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
    </>
  );
};
