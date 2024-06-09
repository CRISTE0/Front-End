import React from "react";
import axios from "axios";
import { Canvas } from "./Canvas";

export const Diseniador = () => {
  return (
    <>
      {/* inicio diseñador  */}
      <div className="bg-light">
        <div className="container">
          <h3 className="text-center py-5">
            <b className="text-dark">Personaliza tu camiseta</b>
          </h3>
              <Canvas />

            {/* <div className="row"> */}
            {/* <div className=" p-5">
            <label htmlFor="text-input">Texto:</label>
            <input type="text" id="text-input" placeholder="Texto aquí" />
            <br />

            <label htmlFor="text-font">Fuente:</label>
            <select id="text-font">
              <option defaultValue="12px Arial">12px Arial</option>
              <option defaultValue="16px Arial">16px Arial</option>
              <option defaultValue="20px Arial">20px Arial</option>
            </select>
            <br />
            
            <label htmlFor="text-color">Color:</label>
            <input type="color" id="text-color" defaultValue="#000000" />
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
                <option defaultValue="">Elige el color de la camiseta</option>
                <option defaultValue="../assets/img/camiseta_blanca.png">
                  Camiseta blanca
                </option>
                <option defaultValue="../assets/img/camiseta_negra.png">
                  Camiseta negra
                </option>
                <option defaultValue="camisa3.jpg">Camiseta 3</option>
              </select>
            </div>

            <input
              type="number"
              id="input-number"
              defaultValue="250"
              min="80"
              max="250"
            />
          </div> */}
        </div>
       
      </div>

      {/* fin diseñador */}
    </>
  );
};
