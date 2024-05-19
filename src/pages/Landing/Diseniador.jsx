import React from "react";

export const Diseniador = () => {
  return (
    <>
      {/* inicio diseñador  */}
      <div className="bg-light">
        <div className="py-3 d-flex">
          <div className="m-5 text-center">
            <h3 className="">
              <b>Personaliza tu camiseta</b>
            </h3>
            <div id="canvas-container">
              <canvas id="canvas" width="500px" height="500px"></canvas>
            </div>
          </div>

          {/* <div className="row"> */}
          <div className=" p-5">
            <label htmlFor="text-input">Texto:</label>
            <input type="text" id="text-input" placeholder="Texto aquí" />
            <br />
            <label htmlFor="text-font">Fuente:</label>
            <select id="text-font">
              <option value="12px Arial">12px Arial</option>
              <option value="16px Arial">16px Arial</option>
              <option value="20px Arial">20px Arial</option>
            </select>
            <br />
            <label htmlFor="text-color">Color:</label>
            <input type="color" id="text-color" value="#000000" />
            <br />

            <button id="add-text-button">Agregar Texto</button>
            <br />
            <input type="file" id="file-input" />

            <button>
              <a href="#" id="download-button" download="mi_diseño.png">
                Descargar/guardar
              </a>
            </button>

            <button id="clear-button" className="bg-danger">
              Limpiar Canvas
            </button>
            <div className=" p-5">
              <select id="shirtSelect">
                <option value="">Elige el color de la camiseta</option>
                <option value="../assets/img/camiseta_blanca.png">
                  Camiseta blanca
                </option>
                <option value="../assets/img/camiseta_negra.png">
                  Camiseta negra
                </option>
                <option value="camisa3.jpg">Camiseta 3</option>
              </select>
            </div>
            <input
              type="number"
              id="input-number"
              value="250"
              min="80"
              max="250"
            />
          </div>
        </div>
      </div>

      {/* fin diseñador */}
    </>
  );
};
