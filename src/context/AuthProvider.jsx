import axios from "axios";
import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth
      ? JSON.parse(storedAuth)
      : { user: null, permissions: [], token:null };
  });

  const [renderTrigger, setRenderTrigger] = useState(false);

  useEffect(() => {
    if (auth.user) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
  }, [auth]);

  const login = async (userData,token) => {
    if (userData.idUsuario) {
      const permisosUsuario = await fetchUserPermissions(userData.idUsuario);
      const permissions = permisosUsuario.Role.Permisos.map((p) => p.Permiso);
      setAuth({ user: userData.nombreUsuario, permissions, token ,idUsuario: userData.idUsuario,});
    } else {
      const permisosCliente = ["Productos", "Diseños", "Pedidos","Carrito"];
      setAuth({ user: userData.nombreUsuario, permissions: permisosCliente, token,idCliente:userData.idCliente });
      
    }
    triggerRender(); // Llamar a triggerRender después de login
  };

  const logout = () => {
    setAuth({ user: null, permissions: [], token: null });
    triggerRender(); // Llamar a triggerRender después de logout
  };

  const triggerRender = () => setRenderTrigger(prev => !prev);

  return (
    <AuthContext.Provider value={{ auth, login, logout, renderTrigger, triggerRender }}>
      {children}
    </AuthContext.Provider>
  );
};

// Función para obtener permisos del usuario
async function fetchUserPermissions(id) {
  try {
    const url = `https://softshirt-1c3fad7d72e8.herokuapp.com/api/usuarios/${id}`;
    let respuesta = await axios.get(url);
    return respuesta.data;
  } catch (error) {
    return null;
  }
}

export const useAuth = () => useContext(AuthContext);
