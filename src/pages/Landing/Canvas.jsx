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

  let [camisaDefault, setCamisaDefault] = useState(camisetasDiseniador[0]);
  let targetG = null;

  // variables diseñador


  // Inicio diseñador
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const bufferCanvas = document.createElement("canvas");
    const bufferContext = bufferCanvas.getContext("2d");



    let shirtSelect = shirtSelectRef.current;
    shirtSelect.addEventListener("change", function () {
      camisaDefault = setCamisaDefault(shirtSelect.value);
      drawElements();
    });



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

    // // Genera imagen referencia
    // // const downloadButton = downloadButtonRef.current;
    // // downloadButton.addEventListener("click", function () {
    // //   console.log("refff");
    //     // Asegúrate de que el contenido esté completamente renderizado
        
    //     // cambie la funct
    //     // drawElements();
    //     // context.drawImage(bufferCanvas, 0, 0); 
        
    //     // Usar setTimeout para asegurar que el contenido se haya renderizado completamente
    //     //setTimeout(() => {
    //       // const dataURL = canvasRef.current.toDataURL("image/png"); 
    //       // setImagenReferencia(dataURL);
    //       // console.log(dataURL);
    //     //   downloadButton.href = dataURL;
    //     //   downloadButton.download = "mi_diseño.png";
    //     //}, 100); // Esperar 100 ms para asegurar el renderizado
    //   // });

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

    }, [textElement, imageElement,camisaDefault]);
    


    // Inicio agregar texto
    const addText = () =>{
      let size = document.getElementById("text-size").value+'px ';
      let tFont = document.getElementById("text-font").value;
      const text = document.getElementById("text-input").value || "siuu";
      const selectTextPosition = document.getElementById("text-position").value;
      let x;
      let y; 
  
      if (selectTextPosition == "Arriba Izquierda") {
        x = 222;
        y = 80; 
      }else if(selectTextPosition == "Arriba Derecha"){
        x = 222;
        y = 60; 
      }else if(selectTextPosition =="Abajo Izquierda"){
        x = 122;
        y = 30; 
      }else if(selectTextPosition =="Abajo Derecha"){
        x = 200;
        y = 20; 
      }else if(selectTextPosition =="Centro"){
        x = 180;
        y = 20; 
      }else{
        location.reload();
      }
  
      const font = size + tFont;
      console.log(font);
      const color = document.getElementById("text-color").value;
  
  
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
        x = 245;
        y = 85; 
      }else if(selectImagePosition == "Arriba Derecha"){
        x = 135;
        y = 85; 
      }else if(selectImagePosition =="Abajo Izquierda"){
        x = 122;
        y = 30; 
      }else if(selectImagePosition =="Abajo Derecha"){
        x = 200;
        y = 20; 
      }else if(selectImagePosition =="Centro"){
        x = 180;
        y = 20; 
      }else{  
        x = 0;
        y = 0; 

      }
  
      // if (selectImageSize == "Grande") {
      //   imageSize = 
      // }else if (selectImageSize == "Mediana"){

      // }else if (selectImageSize == "Mediana"){
        
      // }

      
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

      
      
      //sizeImageRef.current.style.display = 'none';
      // sizeImage.style.display = "none";
      // drawElements();
    };

    // const clearButton = clearButtonRef.current;
    // clearButton.addEventListener("click", clearCanvas);

  //Inicio genera imagen referencia
  const generateImageRefence = () =>{
  console.log("refff");
  const dataURL = canvasRef.current.toDataURL("image/png"); 
  setImagenReferencia(dataURL);

  console.log(dataURL);
  }
  //Fin genera imagen referencia


  const handleTwoFunctionsButtonModal = () =>{
    generateImageRefence();
    
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
  


  const handleImageSizeChange = () => {
    
    setShowImagePosition(true);
    // loadImage();

  }

  const handleImagePositionChange = (e) => {
    setPosicionImagen(e.target.value);
    loadImage();
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
  //Inicio configuracion mensaje de alerta 

  const [preview, setPreview] = useState(null);

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    setImagenDisenio(file);
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    // manejo mostrar input tamaño imagen
    if(imageElement){
      setImageElement(null);
      document.getElementById("image-size").selectedIndex=0;
      // selectSizeImage.selectedIndex=0;
      setShowImagePosition(null);
    }else{
      setShowImageSize(true);
      setShowClearButton(true);
    }
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

                {preview && (
                    <img
                      src={preview}
                      alt="Vista previa de la imagen"
                      style={{ maxWidth: '200px', display: 'block' }}
                    />
                )}

                {/* <input
                  type="text"
                  id="precio"
                  className="form-control"
                  placeholder="Talla"
                  defaultValue={ImagenDisenio}
                  // onChange={handleChangeTalla}
                ></input> */}
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text mx-2">
                  <i className="fas fa-solid fa-ruler-combined"></i>
                </span>
                {/* <input
                  type="text"
                  id="precio"
                  className="form-control"
                  placeholder="Talla"
                  defaultValue={ImagenReferencia}
                  // onChange={handleChangeTalla}
                ></input> */}

                {ImagenReferencia && (
                    <img
                      src={ImagenReferencia}
                      alt="Vista previa de la imagen"
                      style={{ maxWidth: '200px', display: 'block' }}
                    />
                )}
              </div>

              <div className="modal-footer">
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
      </div>

      <div className="col-sm pl-5">
        <input type="text" id="text-input" placeholder="Escribe aquí" onChange={handleTextChange}/>
        <br />
        <br />

        {showTextFont && (
          <>
            <select id="text-font" onChange={handleTextFontChange} defaultValue={""}>
              <option value="" disabled>Elige la fuente del texto</option>
              <option value="Arial">Arial</option>
              <option value="Verdana">Verdana</option>
              <option value="Comic Sans MS">Comic Sans</option>
            </select>
            
            <br />
            <br />
          </>
        )}

        {showTextFontSize && (
        <> 
        <input type="number" defaultValue="30" min={30} max={90} id="text-size" onChange={handleFontSizeChange}/>
        <br />
        <br />
        
        </>
        )}

        {showTextColor &&(
        <>
        <input type="color" id="text-color" onChange={handleFontColorChange}/>

        <br />
        <br />
        </>
        )}

        {showTextPosition &&(
        <>
          <select id="text-position" onChange={handleTextPositionChange} defaultValue={""}>
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
        <input type="file" id="file-input" ref={fileInputRef} onChange={handleImagePreview}/>

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
          <select id="shirtSelect" ref={shirtSelectRef}>
            <option value= {camisetasDiseniador[0]}>Blanca</option>
            <option value= {camisetasDiseniador[2]}>
              Negra
            </option>
          </select>
        </div>
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
