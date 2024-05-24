import React from "react";


// Estilos landing
// import "../assets/css/bootstrap.min.css"
// import "../assets/css/templatemo.css"
// import "../assets/css/custom.css"
// import "../assets/css/fontawesome.min.css"


// <!-- Scripts Landing -->
{/* <>
<script src="/src/assets/js/jquery-1.11.0.min.js" />
<script src="/src/assets/js/jquery-migrate-1.2.1.min.js"></script>
<script src="/src/assets/js/bootstrap.bundle.min.js"></script>
<script src="/src/assets/js/slick.min.js"></script>
<script src="/src/assets/js/templatemo.js"></script>
<script src="/src/assets/js/custom.js"></script>
</> */}



import { LandingFooter } from "../components/Landing/LandingFooter";
import { LandingHeader } from "../components/Landing/LandingHeader";
import imagenesLanding from "../assets/img/imagenesHome";

export const LandingLayout = ({ children }) => {
  return (
  <div>

    <LandingHeader/>

    <>{children}</>

    <LandingFooter/>

  </div>
  );
};

