import React, { useEffect, useRef, useState } from "react";
import camisetasDiseniador from "../../assets/img/camisetasDiseniador";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { subirImageDesign, subirImageReference } from "../../firebase/config";
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
  const [imageElementContainer,setImageElementContent] = useState(null);

  let targetG = null;


  const [currentShirtColor, setCurrentShirtColor] = useState('Blanca');
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [camisaDefault, setCamisaDefault] = useState(camisetasDiseniador['Blanca'][0].elemento);
  // variables diseñador


  // Inicio diseñador
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const bufferCanvas = document.createElement("canvas");
    const bufferContext = bufferCanvas.getContext("2d");


    
    setCamisaDefault(camisetasDiseniador[currentShirtColor][currentPartIndex].elemento);


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
          bufferContext.fillText(textElement.text, textElement.x, textElement.y);
        }
        if (imageElement) {
          bufferContext.drawImage(imageElement.img, imageElement.x, imageElement.y, imageElement.width, imageElement.height);
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(bufferCanvas, 0, 0);
      };
      shirtImage.src = camisaDefault;
    };
    // Fin dibujar elementos


    // const resizeBufferCanvas = function () {
    //   bufferCanvas.width = canvas.width;
    //   bufferCanvas.height = canvas.height;
    // };

    // window.addEventListener("resize", resizeBufferCanvas);
    
    
    // const addTextButton = addTextButtonRef.current;
    // addTextButton.addEventListener("click", addText);
     
    

    // const getEventCoordinates = function (event) {
    //   let x, y;
    //   if (event.pageX || event.pageY) {
    //     x = event.pageX;
    //     y = event.pageY;
    //   } else {
    //     x = event.touches[0].clientX;
    //     y = event.touches[0].clientY;
    //   }
    //   x -= canvas.offsetLeft;
    //   y -= canvas.offsetTop;
    //   return { x: x, y: y };
    //   };
      
    //   let selectedElement = null;

    // const startDrag = function (event) {
    //   const { x, y } = getEventCoordinates(event);
    //   selectedElement = null;

    //   let cursorStyle = "default";

    //   for (let i = elements.length - 1; i >= 0; i--) {
    //     const element = elements[i];
    //     if (element.type === "text") {
    //       const textWidth = bufferContext.measureText(element.text).width;
    //       const textHeight = parseInt(element.font);
    //       if (
    //         x >= element.x &&
    //         x <= element.x + textWidth &&
    //         y >= element.y - textHeight &&
    //         y <= element.y
    //         ) {
    //           selectedElement = element;
    //           cursorStyle = "move";
    //           break;
    //           }
    //           } else if (element.type === "image") {
    //             if (
    //               x >= element.x &&
    //               x <= element.x + element.width &&
    //               y >= element.y &&
    //               y <= element.y + element.height
    //       ) {
    //         selectedElement = element;
    //         cursorStyle = "move";
    //         break;
    //       }
    //     }
    //   }

    //   canvas.style.cursor = cursorStyle;
    // };

    // const drag = function (event) {
    //   if (selectedElement) {
    //     const { x, y } = getEventCoordinates(event);
    //     selectedElement.x = x;
    //     selectedElement.y = y;
    //     drawElements();
    //   }
    // };

    // const endDrag = function () {
    //   selectedElement = null;
    //   canvas.style.cursor = "default";
    //   };
      
    // canvas.addEventListener("mousedown", startDrag);
    // // canvas.addEventListener("touchstart", startDrag);
    // canvas.addEventListener("mousemove", drag);
    // // canvas.addEventListener("touchmove", drag);
    // canvas.addEventListener("mouseup", endDrag);
    // // canvas.addEventListener("touchend", endDrag);


    //   // drawElementsVisible();
      
    const resizeBufferCanvas = () => {
      bufferCanvas.width = canvas.width;
      bufferCanvas.height = canvas.height;
    };

      
    window.addEventListener('resize', resizeBufferCanvas);
    
    drawElements();
    resizeBufferCanvas();

    return () => {
      window.removeEventListener('resize', resizeBufferCanvas);
    };

    }, [textElement, imageElement,camisaDefault,currentShirtColor,
      currentPartIndex]);
    
    // Fin useEffect





    // Inicio agregar texto
    const addText = () =>{
      let size = document.getElementById("text-size").value+'px ';
      let tFont = document.getElementById("text-font").value;
      const text = document.getElementById("text-input").value || "siuu";
      const selectTextPosition = document.getElementById("text-position").value;
      let x;
      let y; 
  
      if (selectTextPosition == "Arriba Izquierda") {
        x = 275;
          y = 85; 
      }else if(selectTextPosition == "Arriba Derecha"){
        x = 135;
        y = 85; 
      }else if(selectTextPosition =="Abajo Izquierda"){
        x = 275;
        y = 285;
      }else if(selectTextPosition =="Abajo Derecha"){
        x = 140;
        y = 285; 
      }else if(selectTextPosition =="Centro"){
        x = 210;
        y = 115;
      }else{
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

        }else{
          x = 245;
          y = 85; 
        }
      }else if(selectImagePosition == "Arriba Derecha"){
        x = 135;
        y = 85; 
      }else if(selectImagePosition =="Abajo Izquierda"){
        if (selectImageSize == "35") {
          x = 275;
          y = 285;
        }else{
          x = 245;
          y = 285; 
        }
      }else if(selectImagePosition =="Abajo Derecha"){
        x = 140;
        y = 285; 
      }else if(selectImagePosition =="Centro"){
        if (selectImageSize == "75") {
          x = 190;
          y = 115; 
        }else if (selectImageSize == "35") {
          x = 210;
          y = 115;
        }else{
          x = 154;
          y = 115; 
        }
      }else if(selectImagePosition =="CentroM"){
        x = 190;
        y = 115; 
      }else if(selectImagePosition =="CentroP"){
        x = 210;
        y = 115; 
      }else if(selectImagePosition =="Arriba "){
        x = 165;
        y = 175; 
      }else if(selectImagePosition =="Centro "){
        x = 165;
        y = 235; 
      }else if(selectImagePosition =="Abajo "){
        x = 165;
        y = 285; 
      }else if(selectImagePosition =="Arriba  "){
        x = 210;
        y = 175; 
      }else if(selectImagePosition =="Centro  "){
        x = 210;
        y = 235; 
      }else if(selectImagePosition =="Abajo  "){
        x = 210;
        y = 285; 
      }else{  
        x = 0;
        y = 0; 

      }
      
      const img = new Image();
      img.src = URL.createObjectURL(target.files[0]);
      img.onload = () => {
        const element = {
          type: 'image',
          img: img,
          x: x,
          y: y,
          width: selectImageSize ? selectImageSize: 220,
          height: selectImageSize ? selectImageSize: 220,
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
      document.getElementById("text-input").value="";
      document.getElementById("file-input").value="";
      setShowCreateButton(null);
      setShowTextFont(null);
      setShowTextFontSize(null);
      setShowTextColor(null);
      setShowTextPosition(null);
      setShowImageSize(null);
      setShowImagePosition(null)
      setShowClearButton(null);
    };

    const setElements = () =>{
      setTextElement(null);
      setImageElement(null);
      document.getElementById("text-input").value="";

      
      
      // document.getElementById("file-input").value="";
      setShowCreateButton(null);
      setShowTextFont(null);
      setShowTextFontSize(null);
      setShowTextColor(null);
      setShowTextPosition(null);
      // setShowImageSize(null);
      setShowImagePosition(null)
      setShowClearButton(null);
      
      handleShowSizeImage();
      console.log("setElements");
      
      if (showImageSize) {
        document.getElementById("image-size").selectedIndex=0;
      }
    }



    //Inicio genera imagen referencia
    const generateImageReference = () =>{
      console.log("refff");
      const dataURL = canvasRef.current.toDataURL("image/png"); 
      setImagenReferencia(dataURL);

      console.log(dataURL);
    }
    //Fin genera imagen referencia


    const insertSizesDesign = () =>{

      const sizesDesign = {
        150: {
          ancho: '21cm',
          largo: '27cm',
        },
        75: {
          ancho: '15cm',
          largo: '20cm',
        },
        35: {
          ancho: '10cm',
          largo: '15cm',
        },
      };

      const selectSizes = document.getElementById("image-size");
      let selectedValue = selectSizes.value;
      console.log(selectedValue);
      const selectedMeasures = sizesDesign[selectedValue];

      const container= document.getElementById("sizesDesign");

      container.innerHTML= `
        <div className="my-3 p-2">
        <p className="my-3"> <b>Ancho:</b> ${selectedMeasures.ancho}</p>  
        <p className="my-3"> <b>Largo:</b> ${selectedMeasures.largo}</p>
        </div>
      `;
    }

    // manejar funciones de generar imagen de referencia y abrir modal
    const handleTwoFunctionsButtonModal = () =>{
      generateImageReference();

      insertSizesDesign();
      
      setTimeout(() => {
        openModal(1);
      }, 100);
    }



  
  const [text, setText] = useState(null);
  
  const [showTextFont, setShowTextFont] = useState(null);
  const [showTextFontSize, setShowTextFontSize] = useState(null);
  const [showTextColor, setShowTextColor] = useState(null);
  const [showTextPosition, setShowTextPosition] = useState(null);
  const [showCreateButton,setShowCreateButton] = useState(false);

  const [showImageSize,setShowImageSize] = useState(null);  
  const [showImagePosition,setShowImagePosition] = useState(null);  

  const[showButtonClear,setShowClearButton] = useState(null);
  


  const handleImageSizeChange = (e) => {
    setShowImagePosition(true);
    setShowCreateButton(false);
    setShowClearButton(false);
    
    setTimeout(() => {
      let selectImagePosition = document.getElementById("image-position");
        
      let selectSizeImage= e.target.value;
      let selectSizeImageOptions= e.target.options;


      
      // condicion para imagen grande (eliminar las demas opciones)
      if (selectSizeImage === '150') {

        for (let i = selectImagePosition.length-2; i >=1 ; i--) {
          selectImagePosition.remove(i);
        }
        selectImagePosition.selectedIndex=0;

      }else{
        if (selectImagePosition.length <= 2) {
          setShowImagePosition(false);
          setTimeout(()=> {
          setShowImagePosition(true);
          
          },10);
        }
        selectImagePosition.selectedIndex=0;

      }


      let currentPositionShirt = document.getElementById("textPositionShirt").textContent;

      // evalua si la posicion actual esta en el hombro derecho
      if (currentPositionShirt == "Hombro Derecho") {
        if (selectSizeImage === '75') {

          const newOptions = [
            { value: 'Arriba ', text: 'Arriba' },
            { value: 'Centro ', text: 'Centro' },
            { value: 'Abajo ', text: 'Abajo' }
          ];

          // elimino todos los option excepto 1
          while (selectImagePosition.options.length > 1) {
            selectImagePosition.remove(1);
          }

          // agrego las nuevas opciones al select
          newOptions.forEach(optionData => {
            const option = document.createElement("option");
            option.value = optionData.value;
            option.text = optionData.text;
            selectImagePosition.appendChild(option);
          });
        }

      // evalua si la posicion actual esta en el hombro izquierdo
      }else if(currentPositionShirt == "Hombro Izquierdo"){
        if (selectSizeImage === '75') {

          const newOptions = [
            { value: 'Arriba  ', text: 'Arriba' },
            { value: 'Centro  ', text: 'Centro' },
            { value: 'Abajo  ', text: 'Abajo' }
          ];

          // elimino todos los option excepto 1
          while (selectImagePosition.options.length > 1) {
            selectImagePosition.remove(1);
          }

          // agrego las nuevas opciones al select
          newOptions.forEach(optionData => {
            const option = document.createElement("option");
            option.value = optionData.value;
            option.text = optionData.text;
            selectImagePosition.appendChild(option);
          });
        }

      }  
    }, 100);
  }

  const handleImagePositionChange = (e) => {

    setPosicionImagen(e.target.value);
    loadImage();
    setShowClearButton(true);
    setShowCreateButton(true);
  }



  const handleTextChange =(e) =>{
    let text = e.target.value;
    console.log(text); 
    setText(text);
    setShowTextFont(true);
    setShowClearButton(true);

    if (text === "") {
      setTextElement(null);
      setShowTextFont(false);

      setShowTextFontSize(false);

      setShowTextColor(false);
  
      setShowTextPosition(false);

      setFuente(null);
      setTamanioFuente(null);
      setColorFuente(null);
      setPosicionFuente(null);

      
      
      
      if (!showImageSize) {
        setShowClearButton(false);
        setShowCreateButton(false);
      }else{
        setShowCreateButton(true);
        setShowClearButton(true);
      }

    }
  }

  const handleTextFontChange =(e) =>{
    setFuente(e.target.value);
    setShowTextFontSize(true);
  }

  const handleFontSizeChange =(e) =>{
    setTamanioFuente(e.target.value);
    setShowTextColor(true);
  }

  const handleFontColorChange =(e) =>{
    setColorFuente(e.target.value);
    setShowTextPosition(true);
  }

  const handleTextPositionChange =(e) =>{
    setPosicionFuente(e.target.value);

    addText();

    setShowCreateButton(true);
    
  }


  

  // Fin diseñador


  // Inicio creacion diseño
  const url = "http://localhost:3000/api/disenios";

  const [IdDisenio,setIdIdDisenio] = useState("");
  const [Fuente, setFuente] = useState("");
  const [TamanioFuente, setTamanioFuente] = useState("");
  const [ColorFuente, setColorFuente] = useState("");
  const [PosicionFuente, setPosicionFuente] = useState("");
  const [PosicionImagen, setPosicionImagen] = useState("");
  const [ImagenDisenio, setImagenDisenio] = useState(null);
  const [ImagenReferencia, setImagenReferencia] = useState(null);
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");

  // const[ulrDesign,setulrDesign] = useState("");
  // const[ulrReference,setulrReference] = useState("");


  // abrir modal
  const openModal = (op) => {
    console.log("modal");

    if (op === 1) {
      // Crear diseño
      setIdIdDisenio("");
      if (!Fuente) {
        setFuente("No aplica");
        setTamanioFuente("No aplica");
        setColorFuente("No aplica");
        setPosicionFuente("No aplica");
     
      }else if(!PosicionImagen){
        setPosicionImagen("No aplica");

      }
      else{
        setFuente(Fuente);
        setTamanioFuente(TamanioFuente);
        setColorFuente(ColorFuente);
        setPosicionFuente(PosicionFuente);
        setPosicionImagen(PosicionImagen);
        
      }
      // setImagenDisenio();
      // setImagenReferencia();
      setOperation(1);
      setTitle("Crear Diseño");
    }
  };
  // abrir modal

  //Inicio validacion diseño

  const validar = async ()  => {
    try {
      var parametros;
      var metodo;
      
      const ulrDesign= await subirImageDesign(ImagenDisenio);
      const ulrReference= await subirImageReference(ImagenReferencia);
 

      if (Fuente == "") {
        show_alerta("Selecciona una fuente", "warning");
      }else if(TamanioFuente === ""){
        show_alerta("Selecciona un tamaño para la fuente", "warning");
      }else if(ColorFuente === ""){
        show_alerta("Selecciona un color para la fuente ", "warning");
      }else if(PosicionFuente === ""){
        show_alerta("Selecciona una posición para la fuente ", "warning");
      }else if(PosicionImagen === ""){
        show_alerta("Selecciona una posición para la imagen", "warning");
  
      }else if(ImagenDisenio === ""){
        show_alerta("Error del sistema vuelva a intentarlo", "error");
  
      }else if(ImagenReferencia === ""){
        show_alerta("Error del sistema vuelva a intentarlo", "warning");
      }   
      else {
        if (operation === 1) {
          parametros = {
            Fuente: Fuente.trim(),
            TamanioFuente: TamanioFuente.trim(),
            ColorFuente: ColorFuente.trim(),
            PosicionFuente: PosicionFuente.trim(),
            PosicionImagen: PosicionImagen.trim(),
            ImagenDisenio: ulrDesign,
            ImagenReferencia: ulrReference
          };
          metodo = "POST";
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
      //POST
      await axios({ method: metodo, url: url, data: parametros })
        .then(function (respuesta) {
          console.log(respuesta);
          var tipo = respuesta.data[0];
          var msj = respuesta.data.message;

          show_alerta(msj, "success");
          document.getElementById("btnCerrar").click();
        })
        .catch(function (error) {
          if (!error.response.data.error) {
            let mensaje = error.response.data.message;

            show_alerta(mensaje, "error");
          } else {
            show_alerta(error.response.data.error, "error");
          }
          console.log(error);
          console.log(error.response.data.error);
        });
    }
  };
  //Fin enviar solicitud creacion


  //Inicio configuracion mensaje de alerta 
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
          progressBar.style.backgroundColor = 'black';
          progressBar.style.height = '3.5px';
        }
      }
    });
  };
  //Fin configuracion mensaje de alerta 


  
  //inicio manejo mostrar select tamaño (mediano) imagen
  const handleShowSizeImage = () =>{

    // if(imageElement){
    //   setImageElement(null);
    //   document.getElementById("image-size").selectedIndex=0;
    //   setShowImagePosition(null);

    // }
    // else{
      // si hay un archivo (imagen) entra
      if (document.getElementById("file-input").value) {
        setShowImageSize(true);
        
      setTimeout(()=>{
        let currentPositionShirt = document.getElementById("textPositionShirt").textContent;
        
        
        let selectSizeImage= document.getElementById("image-size");
        
        // evalua si esta en uno de los dos hombros
        if (currentPositionShirt == "Hombro Izquierdo" || currentPositionShirt == "Hombro Derecho") {
          
          const valuesToRemove = ['150','35'];
          
          // Iterar sobre las opciones del select de manera inversa para evitar problemas de índice
          for (let i = selectSizeImage.options.length - 1; i >= 0; i--) {
            // eliminar los valores deseados (Grande y pequeño)
            if (valuesToRemove.includes(selectSizeImage.options[i].value)) {
              selectSizeImage.remove(i);
            }
          }
          console.log("tamaños eliminados");
        
          // si no esta en los hombros esta en los dos restantes
        }else if (document.getElementById("file-input").value) {
          setShowImageSize(false);
          setTimeout(() => {
          setShowImageSize(true);
          console.log("image size select reseteado");

        }, 30);
        }else{
          setShowImageSize(false);
          console.log("image size select false");

        }
      },30)
  }
  // else{
  //   console.log("else vacio show size image");
  // }
    
  // }
}
  //fin manejo mostrar select tamaño (mediano) imagen

  
  const [imagenDisenio, setimagenDisenio] = useState(null);

  // cargar la imagen que se usara en el diseño
  const handleImageimagenDisenio = (e) => {
    const file = e.target.files[0];
    setImagenDisenio(file);
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setimagenDisenio(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      
      setImageElement(null);
      setimagenDisenio(null);
      setShowImageSize(null);
      setShowImagePosition(null);
      setShowCreateButton(null);
      setShowClearButton(null);

    }

    handleShowSizeImage();

  };

  


  const handleShirtChange = () => {
    const selectedShirtColor = shirtSelectRef.current.value;
    setCurrentShirtColor(selectedShirtColor);
    setCurrentPartIndex(0); // Reset the index to show the first part of the new shirt
    setCamisaDefault(camisetasDiseniador[currentShirtColor][currentPartIndex].elemento);

  };

  // funcion para menejar el boton siguiente
  const handleNextPart = () => {
    setCurrentPartIndex((prevIndex) =>
      prevIndex < camisetasDiseniador[currentShirtColor].length - 1 ? prevIndex + 1 : 0
    );

    setElements();
  };

  // funcion para menejar el boton anterior
  const handlePreviousPart = () => {
    setCurrentPartIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : camisetasDiseniador[currentShirtColor].length - 1
    );

    setElements();

  };

  const testChangeShirt= () => {
    setCamisaDefault(testChangeShirt);
  }

  const insertTableMeasures = () =>{

    const measures = {
      XXS: {
          ancho: '45cm',
          largo: '64cm',
          manga: '18.5cm'
      },
      XS: {
          ancho: '47cm',
          largo: '66cm',
          manga: '19cm'
      },
      S: {
          ancho: '50cm',
          largo: '69cm',
          manga: '20cm'
      },
      M: {
        ancho: '53cm',
        largo: '72cm',
        manga: '21cm'
      },
      L: {
        ancho: '56cm',
        largo: '74cm',
        manga: '22cm'
      },
      XL: {
        ancho: '59cm',
        largo: '76cm',
        manga: '22cm'
      },
      XXL: {
        ancho: '62cm',
        largo: '78cm',
        manga: '23cm'
      },
    };

    const selectSizes = document.getElementById("selectSizes");
    let selectedValue = selectSizes.value;
    const selectedMeasures = measures[selectedValue];

    const container= document.getElementById("tableSizesShirt");

    container.innerHTML= `
      <div className="my-3 p-2">
        <p> <b>Ancho:</b> ${selectedMeasures.ancho}</p>
        <p className="my-3"> <b>Largo:</b> ${selectedMeasures.largo}</p>
        <p className="my-3"> <b>Manga:</b> ${selectedMeasures.manga}</p>
      </div>
    `;

  }

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
              <input
                type="hidden"
                id="id"
                value={IdDisenio}
                onChange={(e) => setIdIdDisenio(e.target.value)}
              ></input>

              <div className="input-group mb-3">
                <span className="input-group-text mx-2">
                  <i className="fas fa-solid fa-ruler-combined"></i>
                </span>
                <input
                  type="text"
                  id="precio"
                  className="form-control"
                  placeholder="Talla"
                  defaultValue={Fuente}
                  // onChange={handleChangeTalla}
                ></input>
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text mx-2">
                  <i className="fas fa-solid fa-ruler-combined"></i>
                </span>
                <input
                  type="text"
                  id="precio"
                  className="form-control"
                  placeholder="Talla"
                  defaultValue={TamanioFuente}
                  // onChange={handleChangeTalla}
                ></input>
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text mx-2">
                  <i className="fas fa-solid fa-ruler-combined"></i>
                </span>
                <input
                  type="text"
                  id="precio"
                  className="form-control"
                  placeholder="Talla"
                  defaultValue={ColorFuente}
                  // onChange={handleChangeTalla}
                ></input>
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text mx-2">
                  <i className="fas fa-solid fa-ruler-combined"></i>
                </span>
                <input
                  type="text"
                  id="precio"
                  className="form-control"
                  placeholder="Talla"
                  defaultValue={PosicionFuente}
                  // onChange={handleChangeTalla}
                ></input>
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text mx-2">
                  <i className="fas fa-solid fa-ruler-combined"></i>
                </span>
                <input
                  type="text"
                  id="precio"
                  className="form-control"
                  placeholder="Talla"
                  defaultValue={PosicionImagen}
                  // onChange={handleChangeTalla}
                ></input>
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text mx-2">
                  <i className="fas fa-solid fa-ruler-combined"></i>
                </span>

                {imagenDisenio && (
                    <img
                      src={imagenDisenio}
                      alt="Vista previa imagen del diseño"
                      style={{ maxWidth: '200px', display: 'block' }}
                    />
                )}

                <div className="mx-2">
                  <p>Tamaño de Diseño</p>

                  <div id="sizesDesign"></div>
                </div>

                <div className=" mx-1">
                  <i className="tooltipSizesShirt fas fa-info-circle">
                    <span className="tooltiptext">Segun el tamaño elegido, se mostrara el ancho y largo que tendra la imagen </span>
                  </i>
                </div>

              </div>

              <div className="input-group mb-3">
                <span className="input-group-text mx-2">
                  <i className="fas fa-solid fa-ruler-combined"></i>
                </span>

                {ImagenReferencia && (
                    <img
                      src={ImagenReferencia}
                      alt="Vista previa de la imagen"
                      style={{ maxWidth: '200px', display: 'block' }}
                    />
                )}

                <div className="mx-2">

                  <select name="" id="selectSizes" defaultValue={""} onChange={insertTableMeasures}>
                    <option value="" disabled>Cuál es tu talla</option>
                    <option value="XXS">XXS</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                  
                  <div id="tableSizesShirt" className="my-3"></div>

                </div>

                <div className=" mx-2">
                  <i className="tooltipSizesShirt fas fa-info-circle">
                    <span className="tooltiptext">Segun la opcion, se mostrara el tamaño de cada camiseta</span>
                  </i>
                </div>


              </div>

              <div className="modal-footer bg-light">
                <div className="text-right">
                  <button
                    type="button"
                    id="btnCerrar"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Cancelar
                  </button>

                  <button onClick={() => validar()} className="btn btn-success">
                    <i className="fa-solid fa-floppy-disk"></i> Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    {/* Fin modal crear diseño */}



    <div className="row">
      <div className="canvas-container">
        <canvas ref={canvasRef} id="canvas" width={500} height={500}></canvas>

        <div className="d-flex align-items-center justify-content-between">
            <button onClick={handlePreviousPart}>Anterior</button>
            
            <span >
              <p id="textPositionShirt"> 
              {camisetasDiseniador[currentShirtColor][currentPartIndex].nombre}
              </p>
            </span>
            <button onClick={handleNextPart}>Siguiente</button>
          </div>
      </div>

      <div className="col-sm pl-5 form-control">
        <input type="text" id="text-input" className="col-md-6" placeholder="Escribe aquí" onChange={handleTextChange}/>
        <br />
        <br />

        {showTextFont && (
          <>
            <select id="text-font" className="col-md-6" onChange={handleTextFontChange} defaultValue={""}>
              <option value="" disabled>Elige la fuente del texto</option>
              <option value="Palatino">Palatino</option>
              <option value="Trebuchet MS">Trebuchet MS</option>
              <option value="Comic Sans MS">Comic Sans</option>
              <option value="Courier New">Courier New</option>
              <option value="Consolas">Consolas</option>
            </select>
            
            <br />
            <br />
          </>
        )}

        {showTextFontSize && (
        <> 
        <input type="number" defaultValue="30" min={30} max={90} id="text-size" className="form-control col-md-6" onChange={handleFontSizeChange}/>
        <br />
        <br />
        
        </>
        )}


        {showTextColor &&(
        <>
        <input type="color" id="text-color" className="form-control col-md-2" onChange={handleFontColorChange}/>

        <br />
        <br />
        </>
        )}

        {showTextPosition &&(
        <>
          <select id="text-position" className="form-control col-md-6" onChange={handleTextPositionChange} defaultValue={""}>
            <option value="" disabled>Elige la posicion del texto</option>
            <option value="Arriba Izquierda">Arriba Izquierda</option>
            <option value="Arriba Derecha">Arriba Derecha</option>
            <option value="Abajo Izquierda">Abajo Izquierda</option>
            <option value="Abajo Derecha">Abajo Derecha</option>
            <option value="Centro">Centro</option>
          </select>
          
          <br />
          <br />
        </>
        )}

        <br />

        {/* <button id="add-text" ref={addTextButtonRef}>
          Agregar Texto
        </button> */}

        <br />
        <br />
          
        {/* Inicio atributos imagen */}
        <input type="file" id="file-input" ref={fileInputRef} onChange={handleImageimagenDisenio}/>

        {showImageSize &&(
        <>
        <br />
        <select id="image-size"  defaultValue={""} onChange={handleImageSizeChange}>
        <option value="" disabled>Elige el tamaño de la imagen</option>
          <option value="150">Grande</option>
          <option value="75">Mediana</option>
          <option value="35">Pequeña</option>
        </select>
        </>
        )}
        <br />
        <br />

        {showImagePosition &&(
          <>
          <select id="image-position" onChange={handleImagePositionChange} defaultValue={""}>
            <option value="" disabled>Selecciona una posición para la imagen</option>
            <option value="Arriba Izquierda">Arriba Izquierda</option>
            <option value="Arriba Derecha">Arriba Derecha</option>
            <option value="Abajo Izquierda">Abajo Izquierda</option>
            <option value="Abajo Derecha">Abajo Derecha</option>
            <option value="Centro">Centro</option>
          </select>
          <br />
          <br />
          </>

        )}

        {/* Fin atributos imagen */}

        

        {showCreateButton &&(
        <div className="text-center p-3">
            <button
              onClick={() => handleTwoFunctionsButtonModal()} 
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#modalTallas"
              // ref={downloadButtonRef}
            >
              <i className="fas fa-pencil-alt"></i> Crear Diseño
            </button>
        </div>

        )}

        <br />
        <br />
        


        {showButtonClear &&(
        <button id="clear-button"  onClick={clearCanvas}>
          Limpiar Diseño
        </button>

        )}


        <div className="p-5">
          <select id="shirtSelect" ref={shirtSelectRef} onChange={handleShirtChange}>
            <option value="Blanca">Blanca</option>
            <option value="Negra">Negra</option>
          </select>

          
          
        </div>


        



        {/* <div className="p-5">
          <select id="shirtSelect"  onChange={testChangeShirt}>
            <option value= {camisetasDiseniador['Blanca'][0]}>Blanca</option>
            <option value= {camisetasDiseniador['Blanca'][1]}>Negra</option>
            <option value="" >BHI</option>
          </select>
        </div> */}



      </div>
    </div>
    </>
  );
};


// codigo para descagarla


    // const drawElementsVisible = function () {

    //   context.clearRect(0, 0, canvas.width, canvas.height);

    //   const shirtImage = new Image();
    //   shirtImage.onload = function () {
    //     context.drawImage(shirtImage, 0, 0);
    //     elements.forEach(function (element) {
    //       if (element.type === "text") {
    //         context.font = element.font;
    //         context.fillStyle = element.color;
    //         context.fillText(element.text, element.x, element.y);
    //       } else if (element.type === "image") {
    //         context.drawImage(
    //           element.img,
    //           element.x,
    //           element.y,
    //           element.width,
    //           element.height
    //         );
    //       }
    //     });
    //   };
    //   shirtImage.src = camisaDefault;
    // };
