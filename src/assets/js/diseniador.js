//Buenooo

window.onload = function () {
  let camisaDefault = "./assets/img/camiseta_blanca.png";
  let camisaN = "../templatemo_559_zay_shop/assets/img/camiseta_negra.png";

  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  const bufferCanvas = document.createElement("canvas"); // Lienzo de búfer
  const bufferContext = bufferCanvas.getContext("2d");
  let elements = [];
  const shirtSelect = document.getElementById("shirtSelect");
  let targetG = null;

  
  let sizeImage = document.getElementById('input-number');
  sizeImage.style.display="none";

  
  sizeImage.addEventListener("change",function () {
      
    let imageIndex = elements.findIndex(element => element.type === "image")
    
    if (imageIndex !== -1) {
        elements.splice(imageIndex,1);
        loadImage(targetG);
        drawElements();
      }   
    console.log(sizeImage.value);
  });

  


  // Add an event listener to the select element
  shirtSelect.addEventListener("change", function () {
    // Set the new shirt image source
    camisaDefault = shirtSelect.value;

    // Call the drawElementsVisible function to redraw the canvas with the new shirt image
    drawElementsVisible();
  });

  // Función para dibujar los elementos en el lienzo visible sin los iconos
  const drawElementsVisible = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);

    const shirtImage = new Image();
    shirtImage.onload = function () {
      context.drawImage(shirtImage, 0, 0);
      elements.forEach(function (element) {
        if (element.type === "text") {
          context.font = element.font;
          context.fillStyle = element.color;
          context.fillText(element.text, element.x, element.y);
        } else if (element.type === "image") {
          context.drawImage(
            element.img,
            element.x,
            element.y,
            element.width,
            element.height
          );
        }
      });
    };
    shirtImage.src = camisaDefault;
  };

  const drawElements = function () {
    bufferContext.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);

    const shirtImage = new Image();
    shirtImage.onload = function () {
      bufferCanvas.width = shirtImage.width;
      bufferCanvas.height = shirtImage.height;
      bufferContext.drawImage(shirtImage, 0, 0);
      elements.forEach(function (element) {
        if (element.type === "text") {
          bufferContext.font = element.font;
          bufferContext.fillStyle = element.color;
          bufferContext.fillText(element.text, element.x, element.y);
        } else if (element.type === "image") {
          bufferContext.drawImage(
            element.img,
            element.x,
            element.y,
            element.width,
            element.height
          );
        }
        // Comentario: No se dibujan los iconos aquí
      });

      // Copiar el búfer en el lienzo visible
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bufferCanvas, 0, 0);
    };
    shirtImage.src = camisaDefault;
  };

  // Restablecer el tamaño del lienzo de búfer al cambiar el tamaño del lienzo visible
  const resizeBufferCanvas = function () {
    bufferCanvas.width = canvas.width;
    bufferCanvas.height = canvas.height;
  };

  // Llamar a la función de redimensionamiento del búfer cuando el lienzo visible cambie de tamaño
  window.addEventListener("resize", resizeBufferCanvas);

  const loadImage = function (event) {
    const target = event.target || targetG;
    targetG = target;
    console.log(target);
    console.log(targetG);
    const img = new Image();
    console.log(img);
    img.src = URL.createObjectURL(target.files[0]);
    img.onload = function () {
      const element = {
        type: "image",
        img: img,
        x: 0,
        y: 0,
        width: sizeImage.value,
        height: sizeImage.value,
      };
      console.log(element);
      elements.push(element);
      drawElements();
    };
    
    sizeImage.style.display="block";
    
    console.log(img);
  };

  const fileInput = document.getElementById("file-input");
  fileInput.addEventListener("change", loadImage);

  const addText = function () {
    const text = document.getElementById("text-input").value || "siuu";
    const x = 222;
    const y = 80;
    const font = document.getElementById("text-font").value;
    const color = document.getElementById("text-color").value;

    const element = {
      type: "text",
      text: text,
      x: x,
      y: y,
      font: font,
      color: color,
    };
    elements.push(element);
    drawElements();
  };

  const addTextButton = document.getElementById("add-text-button");
  addTextButton.addEventListener("click", addText);

  const clearCanvas = function () {
    elements = [];
    sizeImage.style.display="none";
    drawElements();
  };

  const clearButton = document.getElementById("clear-button");
  clearButton.addEventListener("click", clearCanvas);

  // Obtener las coordenadas del evento del ratón o táctil
  const getEventCoordinates = function (event) {
    let x, y;
    if (event.pageX || event.pageY) {
      x = event.pageX;
      y = event.pageY;
    } else {
      x = event.touches[0].clientX;
      y = event.touches[0].clientY;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    console.log(x,y);
    return { x: x, y: y };
  };

  let selectedElement = null;

  const startDrag = function (event) {
    const { x, y } = getEventCoordinates(event);
    selectedElement = null;

    let cursorStyle = "default"; // Por defecto, el cursor es el estándar

    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      if (element.type === "text") {
        const textWidth = bufferContext.measureText(element.text).width;
        const textHeight = parseInt(element.font);
        if (
          x >= element.x &&
          x <= element.x + textWidth &&
          y >= element.y - textHeight &&
          y <= element.y
        ) {
          selectedElement = element;
          cursorStyle = "move"; // Cambiar el cursor al pasar sobre un elemento
          break;
        }
      } else if (element.type === "image") {
        if (
          x >= element.x &&
          x <= element.x + element.width &&
          y >= element.y &&
          y <= element.y + element.height
        ) {
          selectedElement = element;
          cursorStyle = "move"; // Cambiar el cursor al pasar sobre un elemento
          break;
        }
      }
    }

    // Establecer el estilo del cursor
    canvas.style.cursor = cursorStyle;
  };

  const drag = function (event) {
    if (selectedElement) {
      const { x, y } = getEventCoordinates(event);
      selectedElement.x = x;
      selectedElement.y = y;
      drawElements();
    }
  };

  const endDrag = function () {
    selectedElement = null;
    canvas.style.cursor = "default";
  };

  // Manejar eventos de inicio de arrastre y toque
  canvas.addEventListener("mousedown", startDrag);
  canvas.addEventListener("touchstart", startDrag);

  // Manejar eventos de movimiento de arrastre y toque
  canvas.addEventListener("mousemove", drag);
  canvas.addEventListener("touchmove", drag);

  // Manejar evento de finalización de arrastre y toque
  canvas.addEventListener("mouseup", endDrag);
  canvas.addEventListener("touchend", endDrag);

  // Evento de clic en el botón para descargar
  const downloadButton = document.getElementById("download-button");

  downloadButton.addEventListener("click", function () {
    // Generar la imagen para descargar
    const dataURL = canvas.toDataURL("image/png");
    saveImageToServer(dataURL);

    // Restaurar el contexto del búfer antes de dibujar los iconos en el lienzo visible
    context.drawImage(bufferCanvas, 0, 0);

    // Descargar la imagen
    downloadButton.href = dataURL;
    downloadButton.download = "mi_diseño.png"; // Nombre del archivo que se descargará

    // Volver a dibujar los elementos sin los iconos en el lienzo visible
    drawElementsVisible();
  });

  function saveImageToServer(dataURL) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "guardardi.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    const imageData = encodeURIComponent(dataURL);
    const postData = `imageData=${imageData}`;

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          console.log("Imagen guardada en el servidor");
        } else {
          console.error("Error al guardar la imagen en el servidor");
        }
      }
    };

    xhr.send(postData);
  }

  // Llamar a la función inicial de dibujado en el lienzo visible
  drawElements();
  drawElementsVisible();
  resizeBufferCanvas(); // Inicializar el tamaño del búfer
};
