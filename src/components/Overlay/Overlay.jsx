import React from "react";
import { useAuth } from "../../context/AuthProvider";

export const Overlay = () => {
  const { auth } = useAuth();
  const isLoggedIn = auth && auth.idCliente;

  if (isLoggedIn) {
    return null; // No mostrar nada si el usuario está logueado
  }

  return (
    <div
      className="overlay"
      style={{
        position: "fixed", 
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semi-transparente
        backdropFilter: "blur(10px)", // Desenfoque
        zIndex: 1000, // Asegurarse de que esté por encima de todo
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {auth.idUsuario ? (
        <div>
          <h2>Acceso restringido</h2>
          <p>Esta funcionalidad solo está disponible para los clientes.</p>
          <button
            className="btn btn-primary"
            onClick={() => (window.location.href = "/admin")} // Redirigir al login
          >
            Regresar
          </button>
        </div>
      ) : (
        <div>
          <h2>No estás logueado</h2>
          <p>Por favor, inicia sesión para acceder a esta funcionalidad.</p>
          <button
            className="btn btn-primary"
            onClick={() => (window.location.href = "/Login")} // Redirigir al login
          >
            Iniciar Sesión
          </button>
        </div>
      )}
    </div>
  );
};
