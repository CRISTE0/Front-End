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

        </div>
       
      </div>

      {/* fin diseñador */}
    </>
  );
};
