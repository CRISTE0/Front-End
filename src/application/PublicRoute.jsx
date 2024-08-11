import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const PublicRoute = () => {
  const { auth } = useAuth();
  const location = useLocation();

  if (auth.token) {
    // Si el usuario está autenticado, redirige según su rol
    if (auth.permissions.length > 0) {
      
      const redireccion = `/admin/${auth.permissions[0]}`

      return <Navigate to={redireccion} replace />;

    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Si no está autenticado, permite el acceso a la ruta pública
  return <Outlet />;
 
}; 

export default PublicRoute;