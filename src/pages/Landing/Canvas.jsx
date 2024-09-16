import React, { useEffect, useRef, useState } from "react";
import camisetasDiseniador from "../../assets/img/camisetasDiseniador";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {
  subirImageDesign,
  subirImageReference,
  subirImageReferenceDiseniador,
} from "../../firebase/config";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router";
import show_alerta from "../../components/Show_Alerta/show_alerta";
export const Canvas = () => {
  // variables diseñador
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const shirtSelectRef = useRef(null);
  const addTextButtonRef = useRef(null);
  const clearButtonRef = useRef(null);
  const downloadButtonRef = useRef(null);
  const sizeImageRef = useRef(null);

  const [textElement, setTextElement] = useState(null);
  const [imageElement, setImageElement] = useState(null);
  const [imageElementContainer, setImageElementContent] = useState(null);

  let targetG = null;

  const [currentShirtColor, setCurrentShirtColor] = useState("Blanca");
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [camisaDefault, setCamisaDefault] = useState(
    camisetasDiseniador["Blanca"][0].elemento
  );
  // variables diseñador

  // Inicio diseñador
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const bufferCanvas = document.createElement("canvas");
    const bufferContext = bufferCanvas.getContext("2d");

    setCamisaDefault(
      camisetasDiseniador[currentShirtColor][currentPartIndex].elemento
    );

    // let shirtSelect = shirtSelectRef.current;
    // shirtSelect.addEventListener("change", function () {
    //   setCamisaDefault(shirtSelect.value);
    //   // drawElements();
    // });

    // Inicio dibujar elementos
    const drawElements = function () {
      bufferContext.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);

      const shirtImage = new Image();
      shirtImage.onload = function () {
        bufferCanvas.width = shirtImage.width;
        bufferCanvas.height = shirtImage.height;
        bufferContext.drawImage(shirtImage, 0, 0);

        if (textElement) {
          bufferContext.font = textElement.font;
          bufferContext.fillStyle = textElement.color;
          bufferContext.fillText(
            textElement.text,
            textElement.x,
            textElement.y
          );
        }
        if (imageElement) {
          bufferContext.drawImage(
            imageElement.img,
            imageElement.x,
            imageElement.y,
            imageElement.width,
            imageElement.height
          );
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(bufferCanvas, 0, 0);
      };
      shirtImage.src = camisaDefault;
    };
    // Fin dibujar elementos


    const resizeBufferCanvas = () => {
      bufferCanvas.width = canvas.width;
      bufferCanvas.height = canvas.height;
    };

    window.addEventListener("resize", resizeBufferCanvas);

    drawElements();
    resizeBufferCanvas();

    getProductosAdmin();
    getInsumos();
    getTallas();
    getColores();

    return () => {
      window.removeEventListener("resize", resizeBufferCanvas);
    };
  }, [
    textElement,
    imageElement,
    camisaDefault,
    currentShirtColor,
    currentPartIndex,
  ]);

  // Fin useEffect

  // Inicio agregar texto
  const addText = () => {
    let size = document.getElementById("text-size").value + "px ";
    let tFont = document.getElementById("text-font").value;
    const text = document.getElementById("text-input").value || "siuu";
    const selectTextPosition = document.getElementById("text-position").value;
    let x;
    let y;

    if (selectTextPosition == "Arriba Izquierda") {
      x = 275;
      y = 85;
    } else if (selectTextPosition == "Arriba Derecha") {
      x = 135;
      y = 85;
    } else if (selectTextPosition == "Abajo Izquierda") {
      x = 275;
      y = 285;
    } else if (selectTextPosition == "Abajo Derecha") {
      x = 140;
      y = 285;
    } else if (selectTextPosition == "Centro") {
      x = 210;
      y = 115;
    } else {
      location.reload();
    }

    const font = size + tFont;
    console.log(font);
    const color = document.getElementById("text-color").value;
    console.log(color);

    const element = {
      type: "text",
      text: text,
      x: x,
      y: y,
      font: font,
      color: color,
    };
    setTextElement(element);
    console.log(element);
  };
  // Fin agregar texto

  // Inicio cargar imagen diseñador
  const loadImage = (event) => {
    const target = fileInputRef.current;
    // targetG = target;

    let selectImageSize = document.getElementById("image-size").value;

    let selectImagePosition = document.getElementById("image-position").value;

    let x;
    let y;

    if (selectImagePosition == "Arriba Izquierda") {
      if (selectImageSize == "35") {
        x = 275;
        y = 85;
      } else {
        x = 245;
        y = 85;
      }
    } else if (selectImagePosition == "Arriba Derecha") {
      x = 135;
      y = 85;
    } else if (selectImagePosition == "Abajo Izquierda") {
      if (selectImageSize == "35") {
        x = 275;
        y = 285;
      } else {
        x = 245;
        y = 285;
      }
    } else if (selectImagePosition == "Abajo Derecha") {
      x = 140;
      y = 285;
    } else if (selectImagePosition == "Centro") {
      if (selectImageSize == "75") {
        x = 190;
        y = 115;
      } else if (selectImageSize == "35") {
        x = 210;
        y = 115;
      } else {
        x = 154;
        y = 115;
      }
    } else if (selectImagePosition == "CentroM") {
      x = 190;
      y = 115;
    } else if (selectImagePosition == "CentroP") {
      x = 210;
      y = 115;
    } else if (selectImagePosition == "Arriba ") {
      x = 165;
      y = 175;
    } else if (selectImagePosition == "Centro ") {
      x = 165;
      y = 235;
    } else if (selectImagePosition == "Abajo ") {
      x = 165;
      y = 285;
    } else if (selectImagePosition == "Arriba  ") {
      x = 210;
      y = 175;
    } else if (selectImagePosition == "Centro  ") {
      x = 210;
      y = 235;
    } else if (selectImagePosition == "Abajo  ") {
      x = 210;
      y = 285;
    } else {
      x = 0;
      y = 0;
    }

    const img = new Image();
    img.src = URL.createObjectURL(target.files[0]);
    img.onload = () => {
      const element = {
        type: "image",
        img: img,
        x: x,
        y: y,
        width: selectImageSize ? selectImageSize : 220,
        height: selectImageSize ? selectImageSize : 220,
      };
      // setImageElementContent(element);
      setImageElement(element);
      console.log(element);
    };
    // sizeImageRef.current.style.display = 'block';
  };
  // Fin cargar imagen diseñador

  const clearCanvas = () => {
    setTextElement(null);
    setImageElement(null);
    document.getElementById("text-input").value = "";
    document.getElementById("inputFileDisenio").value = "";
    setShowCreateButton(null);
    setShowTextFont(null);
    setShowTextFontSize(null);
    setShowTextColor(null);
    setShowTextPosition(null);
    setShowImageSize(null);
    setShowImagePosition(null);
    setShowClearButton(null);
  };

  const setElements = () => {
    // setTextElement(null);
    setImageElement(null);
    // document.getElementById("text-input").value = "";

    // document.getElementById("file-input").value="";
    setShowCreateButton(null);
    // setShowTextFont(null);
    // setShowTextFontSize(null);
    // setShowTextColor(null);
    // setShowTextPosition(null);
    setShowImageSize(null);
    setShowImagePosition(null);
    setShowClearButton(null);

    handleShowSizeImage();
    console.log("setElements");

    if (showImageSize) {
      document.getElementById("image-size").selectedIndex = 0;
    }
  };

  //Inicio genera imagen referencia
  const generateImageReference = () => {
    console.log("refff");
    const dataURL = canvasRef.current.toDataURL("image/png");
    setImagenReferencia(dataURL);

    console.log(dataURL);
  };
  //Fin genera imagen referencia

  const insertSizesDesign = () => {
    const sizesDesign = {
      150: {
        ancho: "21cm",
        largo: "27cm",
      },
      75: {
        ancho: "15cm",
        largo: "20cm",
      },
      35: {
        ancho: "10cm",
        largo: "15cm",
      },
    };

    const selectSizes = document.getElementById("image-size");
    let selectedValue = selectSizes.value;
    console.log(selectedValue);
    const selectedMeasures = sizesDesign[selectedValue];

    const container = document.getElementById("sizesDesign");

    container.innerHTML = `
        <div className="my-3 p-2">
        <p className="my-3"> <b>Ancho:</b> ${selectedMeasures.ancho}</p>  
        <p className="my-3"> <b>Largo:</b> ${selectedMeasures.largo}</p>
        </div>
      `;
  };

  // manejar funciones de generar imagen de referencia y abrir modal
  const handleTwoFunctionsButtonModal = () => {
    generateImageReference();

    insertSizesDesign();

    setTimeout(() => {
      openModal(1);
    }, 100);
  };

  const [text, setText] = useState(null);

  // const [showTextFont, setShowTextFont] = useState(null);
  // const [showTextFontSize, setShowTextFontSize] = useState(null);
  // const [showTextColor, setShowTextColor] = useState(null);
  // const [showTextPosition, setShowTextPosition] = useState(null);

  const [showCreateButton, setShowCreateButton] = useState(false);

  const [showImageSize, setShowImageSize] = useState(null);
  const [showImagePosition, setShowImagePosition] = useState(null);

  const [showButtonClear, setShowClearButton] = useState(null);

  const handleImageSizeChange = (e) => {
    setShowImagePosition(true);
    setShowCreateButton(false);
    setShowClearButton(false);

    setTimeout(() => {
      let selectImagePosition = document.getElementById("image-position");

      let selectSizeImage = e.target.value;
      let selectSizeImageOptions = e.target.options;

      // condicion para imagen grande (eliminar las demas opciones)
      if (selectSizeImage === "150") {
        for (let i = selectImagePosition.length - 2; i >= 1; i--) {
          selectImagePosition.remove(i);
        }
        selectImagePosition.selectedIndex = 0;
      } else {
        if (selectImagePosition.length <= 2) {
          setShowImagePosition(false);
          setTimeout(() => {
            setShowImagePosition(true);
          }, 10);
        }
        selectImagePosition.selectedIndex = 0;
      }

      let currentPositionShirt =
        document.getElementById("textPositionShirt").textContent;

      // evalua si la posicion actual esta en el hombro derecho
      if (currentPositionShirt == "Hombro Derecho") {
        if (selectSizeImage === "75") {
          const newOptions = [
            { value: "Arriba ", text: "Arriba" },
            { value: "Centro ", text: "Centro" },
            { value: "Abajo ", text: "Abajo" },
          ];

          // elimino todos los option excepto 1
          while (selectImagePosition.options.length > 1) {
            selectImagePosition.remove(1);
          }

          // agrego las nuevas opciones al select
          newOptions.forEach((optionData) => {
            const option = document.createElement("option");
            option.value = optionData.value;
            option.text = optionData.text;
            selectImagePosition.appendChild(option);
          });
        }

        // evalua si la posicion actual esta en el hombro izquierdo
      } else if (currentPositionShirt == "Hombro Izquierdo") {
        if (selectSizeImage === "75") {
          const newOptions = [
            { value: "Arriba  ", text: "Arriba" },
            { value: "Centro  ", text: "Centro" },
            { value: "Abajo  ", text: "Abajo" },
          ];

          // elimino todos los option excepto 1
          while (selectImagePosition.options.length > 1) {
            selectImagePosition.remove(1);
          }

          // agrego las nuevas opciones al select
          newOptions.forEach((optionData) => {
            const option = document.createElement("option");
            option.value = optionData.value;
            option.text = optionData.text;
            selectImagePosition.appendChild(option);
          });
        }
      }
    }, 100);
    setTamanioImagen(
      e.target.value == "150"
        ? "Grande"
        : e.target.value == "75"
        ? "Mediana"
        : "Pequeña"
    );
  };

  const handleImagePositionChange = (e) => {
    setPosicionImagen(e.target.value);
    loadImage();
    setShowClearButton(true);
    setShowCreateButton(true);
  };

  // Fin diseñador

  // Inicio creacion diseño
  const url = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/disenios";
  const { auth } = useAuth();
  const [IdDisenio, setIdIdDisenio] = useState("");
  const [NombreDisenio, setNombreDisenio] = useState("");
  const [TamanioImagen, setTamanioImagen] = useState("");
  const [PosicionImagen, setPosicionImagen] = useState("");
  const [ImagenDisenio, setImagenDisenio] = useState(null);
  const [ImagenReferencia, setImagenReferencia] = useState(null);
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const [isFirstView, setIsFirstView] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [InsumosCliente, setInsumosCliente] = useState([]);
  const [DiseniosCliente, setDiseniosCliente] = useState([]);
  const [productosAdmin, setProductosAdmin] = useState([]);

  const [DisenioClientePost, setDisenioClientePost] = useState([]);

  const [TallasCliente, setTallasCliente] = useState([]);
  const [ColoresCliente, setColoresCliente] = useState([]);
  const [Cantidad, setCantidad] = useState("");

  const [Tallas, setTallas] = useState([]);
  const [Colores, setColores] = useState([]);

  const [IdTallaCliente, setIdTallaCliente] = useState("");
  const [IdColorCliente, setIdColorCliente] = useState("");
  const [IdInsumoCliente, setIdInsumoCliente] = useState("");

  const [errors, setErrors] = useState({
    NombreDisenio: "",
    CantidadCliente: 0,
  });

  // const[ulrDesign,setulrDesign] = useState("");
  // const[ulrReference,setulrReference] = useState("");

  const getProductosAdmin = async () => {
    const respuesta = await axios.get("https://softshirt-1c3fad7d72e8.herokuapp.com/api/productos");

    // productosTotales = respuesta.data;

    setProductosAdmin(respuesta.data);
    console.log(respuesta.data);
  };

  // Obtener los insumos que seran usados por el cliente, estos estan activos y con cantidad
  const getInsumos = async () => {
    const respuesta = await axios.get("https://softshirt-1c3fad7d72e8.herokuapp.com/api/insumos");
    const InsumosActivas = respuesta.data.filter(
      (insumo) => insumo.Estado == "Activo" && insumo.Cantidad >= 3
    );

    console.log(InsumosActivas);

    setInsumosCliente(InsumosActivas);

    // setInsumosTotales(respuesta.data);
  };

  const getTallas = async () => {
    const respuesta = await axios.get("https://softshirt-1c3fad7d72e8.herokuapp.com/api/tallas");
    const TallasActivas = respuesta.data.filter(
      (talla) => talla.Estado === "Activo"
    );
    console.log(TallasActivas);

    setTallas(TallasActivas);
  };

  const getColores = async () => {
    const respuesta = await axios.get("https://softshirt-1c3fad7d72e8.herokuapp.com/api/colores");
    const ColoresActivas = respuesta.data.filter(
      (color) => color.Estado == "Activo"
    );
    console.log(ColoresActivas);

    setColores(ColoresActivas);
  };

  // const obtenerDiseniosCliente = (disenios) =>{

  //   const dihttps://softshirt-1c3fad7d72e8.herokuapp.com = disenios.filter(disenio => disenio.IdUsuario == auth.idCliente);

  //   console.log(disenioFiltradosCliente);

  //   setDiseniosCliente(disenioFiltradosCliente);
  // }

  // const getDisenios = async () => {
  //   const respuesta = await axios.get("https://softshirt-1c3fad7d72e8.herokuapp.com/api/disenios");
  //   const DiseniosActivos = respuesta.data.filter(
  //     (disenio) => disenio.Estado === "Activo"
  //   );
  //   console.log(DiseniosActivos);

  //   setDisenios(DiseniosActivos);

  //   obtenerDiseniosCliente(DiseniosActivos);

  // };

  // abrir modal
  const openModal = (op) => {
    console.log("modal");

    if (op === 1) {
      // Crear diseño
      setIdIdDisenio("");
      setNombreDisenio("");
      setPosicionImagen(PosicionImagen);
      setOperation(1);
      setTitle("Crear Diseño");
      ObtenerColoresTallasCliente();
    }
  };
  // abrir modal

  // Función para generar una referencia aleatoria
  const generarReferencia = () => {
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numeros = "0123456789";

    // Generar tres letras aleatorias
    let parteLetras = "";
    for (let i = 0; i < 3; i++) {
      parteLetras += letras.charAt(Math.floor(Math.random() * letras.length));
    }

    // Generar tres números aleatorios
    let parteNumeros = "";
    for (let i = 0; i < 3; i++) {
      parteNumeros += numeros.charAt(
        Math.floor(Math.random() * numeros.length)
      );
    }

    // Combinar las partes
    return `${parteLetras}-${parteNumeros}`;
  };

  // Función para verificar si la referencia es única
  const esReferenciaUnica = (referencia, productos) => {
    return !productos.some((producto) => producto.referencia === referencia);
  };

  // Función principal para generar una referencia única
  const generarReferenciaUnica = (productos)=> {
    console.log("entro REfUni");

    let nuevaReferencia;
    do {
      nuevaReferencia = generarReferencia();
    } while (!esReferenciaUnica(nuevaReferencia, productos));

    return nuevaReferencia;
  };
// https://softshirt-1c3fad7d72e8.herokuapp.com
  // Funcion para generar el valor de venta del producto
  const generarValorVentaCliente = (IdInsumoCliente) => {
    console.log("entro valVEntaCli");
    console.log(IdInsumoCliente);

    const insumoCliente = InsumosCliente.filter(
      (insumo) => insumo.IdInsumo == IdInsumoCliente
    );

    const valorVentaProductoCliente = precioSugerido(
      DisenioClientePost.PrecioDisenio,
      insumoCliente[0].ValorCompra
    );

    console.log(insumoCliente);
    console.log(valorVentaProductoCliente);

    return Math.round(valorVentaProductoCliente);
  };

  // Funcion para generar el valor de venta del producto
  const generarValorVentaDisenio = (tamanioImagenDisenio) => {
    if (tamanioImagenDisenio == "Grande") {
      return 18000;
    } else if (tamanioImagenDisenio == "Mediana") {
      return 16000;
    } else {
      return 12000;
    }
  };

  // Funcion para generar el precio sugerido
  const precioSugerido = (precioDisenio, precionInsumo) => {
    let subTotal = precioDisenio + precionInsumo;
    let margen = subTotal * 0.3;
    let total = subTotal + margen;

    return total;
  };

  const ObtenerColoresTallasCliente = async () => {
    const coloresUnicos = [];
    const tallasUnicas = [];

    // Filtrar colores y tallas que esten en los insumos para el select del cliente
    InsumosCliente.forEach((insumo) => {
      if (!coloresUnicos.includes(insumo.IdColor)) {
        coloresUnicos.push(insumo.IdColor);
      }
      if (!tallasUnicas.includes(insumo.IdTalla)) {
        tallasUnicas.push(insumo.IdTalla);
      }
    });

    // Filtrar los colores para el select del cliente
    const coloresFiltrados = Colores.filter((color) =>
      coloresUnicos.includes(color.IdColor)
    );

    // Filtrar las tallas para el select del cliente
    const tallasFiltrados = Tallas.filter((talla) =>
      tallasUnicas.includes(talla.IdTalla)
    );

    console.log(coloresFiltrados);
    console.log(tallasFiltrados);

    setColoresCliente(coloresFiltrados);
    setTallasCliente(tallasFiltrados);
  };

  // Función para manejar cambios en el color del cliente
  const handleChangeSelectColorCliente = (e) => {
    const value = e.target.value;

    // Filtra las tallas que estan relacionadas con el color seleccionado
    const tallasFiltradas = InsumosCliente.filter(
      (insumo) =>
        insumo.IdColor === parseInt(value) &&
        insumo.Cantidad > 0 &&
        insumo.Estado === "Activo"
    ).map((insumo) => insumo.IdTalla);

    // Filtrar las nuevas tallas para el select del cliente
    const nuevasTallasFiltradasCliente = Tallas.filter((talla) =>
      tallasFiltradas.includes(talla.IdTalla)
    );

    console.log(tallasFiltradas);

    setIdColorCliente(value);
    setIdTallaCliente("");
    setTallasCliente(nuevasTallasFiltradasCliente);
  };

  // Función para manejar cambios en la talla del cliente
  const handleChangeSelectTallaCliente = (e) => {
    const value = e.target.value;

    setIdTallaCliente(value);
  };

  //Inicio validacion diseño
  const validar = async () => {
    try {
      let parametros;
      let metodo;

      // setTimeout(() => {
      //   setIsFirstView(false);
      // }, 4000);

      // return;

      if (NombreDisenio == "") {
        show_alerta({
          message: "Ingresa un nombre para el diseño",
          type: "warning",
        });
        return;
      } else if (
        !/^[A-Za-zñÑáéíóúÁÉÍÓÚ0-9]+( [A-Za-zñÑáéíóúÁÉÍÓÚ0-9]+)*$/.test(
          NombreDisenio
        )
      ) {
        show_alerta({
          message: "Ingresa un nombre válido para el diseño",
          type: "error",
        });
        return;
      } else if (PosicionImagen === "") {
        show_alerta({
          message: "Selecciona una posición para la imagen",
          type: "warning",
        });
        return;
      } else if (ImagenDisenio === "") {
        show_alerta({
          message: "Error del sistema vuelva a intentarlo",
          type: "error",
        });
        return;
      } else if (ImagenReferencia === "") {
        show_alerta({
          message: "Error del sistema vuelva a intentarlo",
          type: "warning",
        });
        return;
      } else {
        if (operation == 1) {
          const [idDesign, ulrDesign] = await subirImageDesign(ImagenDisenio);
          const [ulrReference, idReference] =
            await subirImageReferenceDiseniador(ImagenReferencia);

          parametros = {
            IdUsuario: auth.idUsuario || auth.idCliente,
            NombreDisenio,
            TamanioImagen,
            PosicionImagen,
            PrecioDisenio: generarValorVentaDisenio(TamanioImagen),
            IdImagenDisenio: idDesign,
            ImagenDisenio: ulrDesign,
            IdImagenReferencia: idReference,
            ImagenReferencia: ulrReference,
            Estado: "Activo",
          };
          metodo = "POST";

          console.log(parametros);

          // return;
          setIsSubmitting(false);
        }
        enviarSolicitud(metodo, parametros);
      }
    } catch (error) {
      console.log("Ocurrio algo: ", error);
    }
  };
  //Fin validacion diseño

  //Inicio enviar solicitud creacion
  const enviarSolicitud = async (metodo, parametros) => {
    if (metodo === "POST") {
      try {
        const respuesta = await axios({
          method: metodo,
          url: url,
          data: parametros,
        });
        console.log(respuesta);

        let msj = respuesta.data.message;

        console.log(respuesta.data.nuevoDisenio);

        setDisenioClientePost(respuesta.data.nuevoDisenio);

        setIsSubmitting(true);

        setIsFirstView(false);

        // show_alerta(msj, "success");
      } catch (error) {
        if (!error.response.data.error) {
          let mensaje = error.response.data.message;

          show_alerta({
            message: mensaje,
            type: "error",
          });
        } else {
          show_alerta({
            message: error.response.data.error,
            type: "error",
          });
        }
        console.log(error);
        console.log(error.response.data.error);
      }
    }
  };
  //Fin enviar solicitud creacion

  const crearProducto = async () => {
    try {
      console.log("siuuuuu");

      // crear detalle del insumo
      const DetallesInsumos = [
        {
          IdColor: IdColorCliente,
          IdTalla: IdTallaCliente,
          cantidad: Cantidad,
        },
      ];

      // converir el color y talla
      // Si no hay errores, reemplazar IdColor e IdTalla por IdInsumo
      const nuevosDetallesInsumos = DetallesInsumos.map((detalle) => {
        const insumoSeleccionado = InsumosCliente.find(
          (insumo) =>
            insumo.IdColor === parseInt(detalle.IdColor) &&
            insumo.IdTalla === parseInt(detalle.IdTalla) &&
            insumo.Estado === "Activo"
        );

        if (insumoSeleccionado) {
          return {
            IdInsumo: insumoSeleccionado.IdInsumo, // Reemplaza IdColor e IdTalla por IdInsumo
            cantidad: detalle.cantidad, // Mantiene la cantidad
          };
        }

        return detalle; // Si no encuentra el insumo, retorna el detalle sin modificar
      });

      console.log("siuuuuu222");

      console.log(nuevosDetallesInsumos);

      if (nuevosDetallesInsumos.length > 0) {
        let idInsumoCliente = nuevosDetallesInsumos[0].IdInsumo;

        let parametrosProductoCliente = {
          IdDisenio: DisenioClientePost.IdDisenio,
          IdUsuario: auth.idCliente,
          Referencia: generarReferenciaUnica(productosAdmin),
          ValorVenta: generarValorVentaCliente(idInsumoCliente),
          Publicacion: "Activo",
          Estado: "Activo",
          Insumos: nuevosDetallesInsumos,
        };

        console.log(parametrosProductoCliente);

        // return;

        const respuesta = await axios.post(
          "https://softshirt-1c3fad7d72e8.herokuapp.com/api/productos",
          parametrosProductoCliente
        );

        console.log(respuesta);

        let msj = respuesta.data.message;

        show_alerta({
          message: respuesta.data.message,
          type: "success",
        });

        let productoNuevo = respuesta.data.nuevoProducto;

        console.log(productoNuevo);

        if (productoNuevo) {
          // // Si el producto no existe, agrégalo con una cantidad inicial de 1
          const cart = JSON.parse(localStorage.getItem("cart")) || [];
          cart.push({
            IdProd: productoNuevo.IdProducto,
            CantidadSeleccionada: 1,
            IdIns: idInsumoCliente,
          });
          localStorage.setItem("cart", JSON.stringify(cart));

          console.log(JSON.parse(localStorage.getItem("cart")));

          $(".close").click();


          navigate("/carrito");
        }
      } else {
        throw new Error("No se encontraron insumos válidos.");
      }
    } catch (error) {
      if (error.response) {
        show_alerta({
          message: error.response.data.message,
          type: "error",
        });
      }
    }
  };

  //inicio manejo mostrar select tamaño (mediano) imagen
  const handleShowSizeImage = () => {
    // si hay un archivo (imagen) entra
    if (document.getElementById("inputFileDisenio").value) {
      setShowImageSize(true);

      setTimeout(() => {
        let currentPositionShirt =
          document.getElementById("textPositionShirt").textContent;

        let selectSizeImage = document.getElementById("image-size");

        // evalua si esta en uno de los dos hombros
        if (
          currentPositionShirt == "Hombro Izquierdo" ||
          currentPositionShirt == "Hombro Derecho"
        ) {
          const valuesToRemove = ["150", "35"];

          // Iterar sobre las opciones del select de manera inversa para evitar problemas de índice
          for (let i = selectSizeImage.options.length - 1; i >= 0; i--) {
            // eliminar los valores deseados (Grande y pequeño)
            if (valuesToRemove.includes(selectSizeImage.options[i].value)) {
              selectSizeImage.remove(i);
            }
          }
          console.log("tamaños eliminados");

          // si no esta en los hombros esta en los dos restantes
        } else if (document.getElementById("inputFileDisenio").value) {
          setShowImageSize(false);
          setTimeout(() => {
            setShowImageSize(true);
            console.log("image size select reseteado");
          }, 30);
        } else {
          setShowImageSize(false);
          console.log("image size select false");
        }
      }, 30)
    }
    // else{
    //   console.log("else vacio show size image");
    // }

    // }
  };
  //fin manejo mostrar select tamaño (mediano) imagen

  const [imagenDisenio, setimagenDisenio] = useState(null);

  // cargar la imagen que se usara en el diseño
  const handleImageDisenio = (e) => {
    const file = e.target.files[0];
    setImagenDisenio(file);
    console.log(file);

    let spanDisenio = document.getElementById("spanInputFileDisenio");

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setimagenDisenio(reader.result);
      };
      reader.readAsDataURL(file);

      let fileName = "";

      fileName = e.target.value.split("\\").pop();

      spanDisenio.innerHTML = fileName;
    } else {
      setImageElement(null);
      setimagenDisenio(null);
      setShowImageSize(null);
      setShowImagePosition(null);
      setShowCreateButton(null);
      setShowClearButton(null);

      spanDisenio.value = null;
      spanDisenio.innerHTML = "Seleccionar archivo";
    }

    handleShowSizeImage();
  };

  const handleShirtChange = () => {
    const selectedShirtColor = shirtSelectRef.current.value;
    setCurrentShirtColor(selectedShirtColor);
    setCurrentPartIndex(0); // Reset the index to show the first part of the new shirt
    setCamisaDefault(
      camisetasDiseniador[currentShirtColor][currentPartIndex].elemento
    );
  };

  // funcion para menejar el boton siguiente
  const handleNextPart = () => {
    setCurrentPartIndex((prevIndex) =>
      prevIndex < camisetasDiseniador[currentShirtColor].length - 1
        ? prevIndex + 1
        : 0
    );

    setElements();
  };

  // funcion para menejar el boton anterior
  const handlePreviousPart = () => {
    setCurrentPartIndex((prevIndex) =>
      prevIndex > 0
        ? prevIndex - 1
        : camisetasDiseniador[currentShirtColor].length - 1
    );

    setElements();
  };

  const testChangeShirt = () => {
    setCamisaDefault(testChangeShirt);
  };

  const insertTableMeasures = () => {
    const measures = {
      XXS: {
        ancho: "45cm",
        largo: "64cm",
        manga: "18.5cm",
      },
      XS: {
        ancho: "47cm",
        largo: "66cm",
        manga: "19cm",
      },
      S: {
        ancho: "50cm",
        largo: "69cm",
        manga: "20cm",
      },
      M: {
        ancho: "53cm",
        largo: "72cm",
        manga: "21cm",
      },
      L: {
        ancho: "56cm",
        largo: "74cm",
        manga: "22cm",
      },
      XL: {
        ancho: "59cm",
        largo: "76cm",
        manga: "22cm",
      },
      XXL: {
        ancho: "62cm",
        largo: "78cm",
        manga: "23cm",
      },
    };

    const selectSizes = document.getElementById("selectSizes");
    let selectedValue = selectSizes.value;
    const selectedMeasures = measures[selectedValue];

    const container = document.getElementById("tableSizesShirt");

    container.innerHTML = `
      <div className="my-3 p-2">
        <p> <b>Ancho:</b> ${selectedMeasures.ancho}</p>
        <p className="my-3"> <b>Largo:</b> ${selectedMeasures.largo}</p>
        <p className="my-3"> <b>Manga:</b> ${selectedMeasures.manga}</p>
      </div>
    `;
  };

  // Función para validar el nombre de diseño
  const validateNombreDisenio = (value) => {
    if (!value) {
      return "Escribe el nombre del diseño";
    }
    if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ0-9]+( [A-Za-zñÑáéíóúÁÉÍÓÚ0-9]+)*$/.test(value)) {
      return "El nombre del diseño solo puede contener letras, tildes, la letra 'ñ' y números con un solo espacio entre palabras";
    }
    return "";
  };

  // Función para validar la cantidad del cliente
  const validateCantidadCliente = (value) => {
    if (!value) {
      return "Escribe la cantidad";
    }
    if (!/^\d+$/.test(value)) {
      return "La cantidad solo puede contener números";
    }
    const numericValue = parseInt(value, 10);
    if (numericValue <= 0) {
      return "La cantidad debe ser un número positivo";
    }
    if (numericValue < 1 || numericValue > 3) {
      return "La cantidad debe estar entre 1 y 3";
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

  // Función para manejar cambios en la cantidad del cliente
  const handleChangeCantidadCliente = (e) => {
    let value = e.target.value;
    setCantidad(value);
    const errorMessage = validateCantidadCliente(value);
    setErrors((prevState) => ({
      ...prevState,
      CantidadCliente: errorMessage,
    }));
  };

  // Función para renderizar los mensajes de error
  const renderErrorMessage = (errorMessage) => {
    return errorMessage ? (
      <div className="invalid-feedback">{errorMessage}</div>
    ) : null;
  };

  // Fin creacion diseño

  return (
    <>
      {/* <!-- Modal para crear diseño --> */}
      <div
        className="modal fade"
        id="modalTallas"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalAñadirTallaLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalAñadirTallaLabel">
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
              {/* Primera vista del modal */}
              {isFirstView && (
                <div className="form-row">
                  <input
                    type="hidden"
                    id="id"
                    value={IdDisenio}
                    onChange={(e) => setIdIdDisenio(e.target.value)}
                  ></input>

                  {/* Nombre del diseño */}
                  <div className="form-group col-md-12 mb-4">
                    <label htmlFor="nombreDisenio">Nombre del diseño </label>

                    <input
                      type="text"
                      id="nombreDisenio"
                      className={`form-control ${
                        errors.NombreDisenio ? "is-invalid" : ""
                      }`}
                      placeholder="Ingresa un nombre para el diseño"
                      value={NombreDisenio}
                      onChange={handleChangeNombreDisenio}
                    />

                    {renderErrorMessage(errors.NombreDisenio)}
                  </div>

                  {/* Posicion del diseño */}
                  <div className="form-group col-md-6 mb-4">
                    <label htmlFor="posicionDiseño">Tamaño del diseño</label>

                    <input
                      type="text"
                      id="posicionDiseño"
                      className="form-control"
                      disabled
                      placeholder="Posicion del diseño"
                      defaultValue={TamanioImagen}
                      // onChange={handleChangeTalla}
                    ></input>
                  </div>

                  {/* Posicion del diseño */}
                  <div className="form-group col-md-6 mb-5">
                    <label htmlFor="posicionDiseño">Posicion del diseño</label>

                    <input
                      type="text"
                      id="posicionDiseño"
                      className="form-control"
                      disabled
                      placeholder="Posicion del diseño"
                      defaultValue={PosicionImagen}
                      // onChange={handleChangeTalla}
                    ></input>
                  </div>

                  {/* Imagen del diseño */}
                  <div className="input-group mb-3">
                    {imagenDisenio && (
                      <img
                        src={imagenDisenio}
                        alt="Vista previa imagen del diseño"
                        style={{ maxWidth: "200px", display: "block" }}
                      />
                    )}

                    <div className="text-dark mx-2">
                      <p>Tamaño del diseño</p>

                      <div id="sizesDesign"></div>
                    </div>

                    <div className=" mx-1">
                      <i className="tooltipSizesShirt fas fa-info-circle">
                        <span className="tooltiptext">
                          Según el tamaño elegido, se mostrará el ancho y largo
                          que tendrá el diseño.
                        </span>
                      </i>
                    </div>
                  </div>

                  {/* Imagen de referencia */}
                  <div className="input-group mb-3">
                    {ImagenReferencia && (
                      <img
                        src={ImagenReferencia}
                        alt="Vista previa de la imagen"
                        style={{ maxWidth: "200px", display: "block" }}
                      />
                    )}

                    <div className="mx-2">
                      <select
                        name=""
                        className="form-control"
                        id="selectSizes"
                        defaultValue={""}
                        onChange={insertTableMeasures}
                      >
                        <option value="" disabled>
                          Guía de tallas
                        </option>
                        <option value="XXS">XXS</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                      </select>

                      <div
                        id="tableSizesShirt"
                        className="my-3 text-dark"
                      ></div>
                    </div>

                    <div className=" mx-2">
                      <i className="tooltipSizesShirt fas fa-info-circle">
                        <span className="tooltiptext">
                          Según la opción, se mostrará el tamaño de cada
                          camiseta (solo referencia, no es necesario elegir
                          alguna).
                        </span>
                      </i>
                    </div>
                  </div>
                </div>
              )}

              {/* Segunda vista del modal */}
              {!isFirstView && (
                <div className="form-row">
                  {/* Color del producto cliente*/}
                  <div className="form-group col-md-6">
                    <label htmlFor="idInsumo">Color de la camiseta</label>
                    <select
                      className="form-control"
                      id="idInsumo"
                      value={IdColorCliente}
                      onChange={(e) => handleChangeSelectColorCliente(e)}
                      required
                    >
                      <option value="" disabled>
                        Seleccione un color
                      </option>
                      {ColoresCliente.map((insumo) => (
                        <option key={insumo.IdColor} value={insumo.IdColor}>
                          {insumo.Color}
                        </option>
                      ))}
                    </select>
                    {IdColorCliente === "" && (
                      <p className="text-danger">
                        Por favor, seleccione un color.
                      </p>
                    )}
                  </div>

                  {/* Talla del producto cliente*/}
                  <div className="form-group col-md-6">
                    <label htmlFor="idColor">Talla de la camiseta</label>
                    <select
                      className="form-control"
                      id="idColor"
                      value={IdTallaCliente}
                      onChange={(e) => handleChangeSelectTallaCliente(e)}
                      required
                    >
                      <option value="" disabled>
                        Seleccione una talla
                      </option>
                      {TallasCliente.map((talla) => (
                        <option key={talla.IdTalla} value={talla.IdTalla}>
                          {talla.Talla}
                        </option>
                      ))}
                    </select>
                    {IdTallaCliente === "" && (
                      <p className="text-danger">
                        Por favor, seleccione una talla.
                      </p>
                    )}
                  </div>

                  {/* Cantidad del producto cliente*/}
                  <div className="form-group col-md-12">
                    <label htmlFor="cantidadProducto">Cantidad</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.CantidadCliente ? "is-invalid" : ""
                      }`}
                      id="cantidadProducto"
                      placeholder={"Ingrese la cantidad del producto"}
                      required
                      value={Cantidad}
                      onChange={handleChangeCantidadCliente}
                    />
                    {renderErrorMessage(errors.CantidadCliente)}
                  </div>
                </div>
              )}

              <div className="modal-footer bg-white">
                <div className="text-right">
                  <button
                    type="button"
                    id="btnCerrar"
                    className="btn btn-secondary mx-4"
                    data-dismiss="modal"
                  >
                    Cancelar
                  </button>

                  {isFirstView ? (
                    <button
                      onClick={() => validar()}
                      className="btn btn-success"
                    >
                      <i className="fa-solid fa-floppy-disk"></i> Guardar
                    </button>
                  ) : (
                    <button
                      onClick={() => crearProducto()}
                      className="btn btn-primary"
                    >
                      Finalizar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Fin modal crear diseño */}

      <div className="row py-5">
        {/* parte del canvas */}

        <div className="canvas-container">
          <canvas ref={canvasRef} id="canvas" width={500} height={500}></canvas>

          {/* Controles partes de la camiseta */}
          <div
            className="d-flex align-items-center justify-content-between mb-5"
            style={{ width: "94%" }}
          >
            <button
              className="btn btn-secondary"
              onClick={handlePreviousPart}
              style={{ borderRadius: "50px" }}
            >
              <i className="fas fa-arrow-left"></i>
            </button>

            <span>
              <p className="text-dark" id="textPositionShirt">
                {
                  camisetasDiseniador[currentShirtColor][currentPartIndex]
                    .nombre
                }
              </p>
            </span>
            <button
              className="btn btn-secondary"
              onClick={handleNextPart}
              style={{ borderRadius: "50px" }}
            >
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>

        {/* parte de inputs */}
        <div className="col-sm pl-5 ml-">
          <div
            className="card p-4 shadow-lg w-60"
            style={{ maxWidth: "650px" }}
          >
            <div className="container">
              <h3 className="text-cente py-2 mb-4">
                <b className="text-dark">Personaliza tu camiseta</b>
              </h3>

              <div className="">
                {/* Input para agregar la imagen del diseño */}
                {auth.idCliente && (
                  <div className="form-group col-md-12">
                    <label htmlFor="ImagenDisenioCliente">
                      Ingresa una imagen para el diseño
                    </label>

                    <br />
                    <input
                      accept=".png, .jpg, .jpeg"
                      type="file"
                      name="file-3"
                      id="inputFileDisenio"
                      ref={fileInputRef}
                      className={`inputfile inputfile-2 `}
                      onChange={handleImageDisenio}
                    />
                    <label
                      htmlFor="inputFileDisenio"
                      style={{ background: "white" }}
                    >
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
                  </div>
                )}

                {/* Select para elegir el tamaño de la imagen */}
                {showImageSize && (
                  <div className="col-md-11 my-3">
                    <label htmlFor="image-size">
                      Selecciona un tamaño para el diseño
                    </label>

                    <select
                      className="form-control "
                      id="image-size"
                      defaultValue={""}
                      onChange={handleImageSizeChange}
                    >
                      <option value="" disabled>
                        Elige el tamaño para el diseño
                      </option>
                      <option value="150">Grande</option>
                      <option value="75">Mediana</option>
                      <option value="35">Pequeña</option>
                    </select>
                  </div>
                )}

                {/* Select para elegir la posicion de la imagen */}
                {showImagePosition && (
                  <div className="col-md-11 my-4">
                    <label htmlFor="image-position">
                      Selecciona una posición para el diseño
                    </label>

                    <select
                      id="image-position"
                      className="form-control"
                      onChange={handleImagePositionChange}
                      defaultValue={""}
                    >
                      <option value="" disabled>
                        Selecciona una posición para el diseño
                      </option>
                      <option value="Arriba Izquierda">Arriba Izquierda</option>
                      <option value="Arriba Derecha">Arriba Derecha</option>
                      <option value="Abajo Izquierda">Abajo Izquierda</option>
                      <option value="Abajo Derecha">Abajo Derecha</option>
                      <option value="Centro">Centro</option>
                    </select>
                    <br />
                    <br />
                  </div>
                )}
              </div>

              {/* Fin atributos imagen */}

              <div className="d-flex justify-content-between flex-wrap">
                {/* Boton para guardar el diseño */}
                {showCreateButton && (
                  <button
                    onClick={() => handleTwoFunctionsButtonModal()}
                    type="button"
                    id="btnDiseniadorCrear"
                    className="btn btn-primary"
                    data-toggle="modal"
                    data-target="#modalTallas"
                    // ref={downloadButtonRef}
                  >
                    <i className="fas fa-pencil-alt"></i> Crear Diseño
                  </button>
                )}

                {/* Boton para limpiar el canvas */}
                {showButtonClear && (
                  <button
                    type="button"
                    className="btn btn-warning"
                    id="clear-button"
                    onClick={clearCanvas}
                  >
                    <i className="fas fa-eraser"></i> Limpiar Diseño
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
