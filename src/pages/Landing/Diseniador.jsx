import React from "react";
import axios from "axios";
import { Canvas } from "./Canvas";
import { Overlay } from "../../components/Overlay/Overlay";

export const Diseniador = () => {
  return (
    <>
      {/* inicio diseñador  */}
      <div className="bg-light">
        <div className="container">
          <Canvas />
          <Overlay />
        </div>
      </div>

      {/* fin diseñador */}
    </>
  );
};
