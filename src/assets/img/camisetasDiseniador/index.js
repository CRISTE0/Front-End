import camisetaBF from "../camisetasDiseniador/camiseta_blanca.png";
import camisetaBE from "../camisetasDiseniador/camiseta_blanca_espalda.png";
import camisetaBHI from "../camisetasDiseniador/camiseta_blanca_hombro_izquierdo.png";
import camisetaBHD from "../camisetasDiseniador/camiseta_blanca_hombro_derecho.png";
import camisetaNF from "../camisetasDiseniador/camiseta_negra.png";
import camisetaNE from "../camisetasDiseniador/camiseta_negra_espalda.png";



// export default [camisetaBF, camisetaBE,camisetaBHI,camisetaBHD, camisetaNF, camisetaNE];
export default {
    Blanca: [
      { nombre: 'Frente', elemento: camisetaBF },
      { nombre: 'Espalda', elemento: camisetaBE },
      { nombre: 'Hombro Izquierdo', elemento: camisetaBHI },
      { nombre: 'Hombro Derecho', elemento: camisetaBHD },
      
    ],

    Negra: [
      { nombre: 'Frente', elemento: camisetaNF },
      { nombre: 'Espalda', elemento: camisetaNE },

    ]
  };