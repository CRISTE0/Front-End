import React from 'react';
import LogoAndroid from '../../assets/img/Logo_Android.png';
import "../../assets/css/loader.css";

const Loader = () => {
  return (
    <div className="loader">
      <div className="spinner">
        <img src={LogoAndroid} alt="Cargando..." />
      </div>
      <div className="loader-text">Cargando...</div>
    </div>
  );
};

export default Loader;
