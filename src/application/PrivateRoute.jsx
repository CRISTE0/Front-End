import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const PrivateRoute = ({ requiredPermissions = [] }) => {
  const { auth } = useAuth();
  const location = useLocation();

  // Si el usaurio no esta logueado lo redirigira al login del admin o del cliente
  if (!auth.token) {
    const loginPath = location.pathname.startsWith('/admin') ? '/admin/Login' : '/Login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (auth.idCliente && requiredPermissions.length > 0 && 
      !requiredPermissions.every(perm => auth.permissions.includes(perm))) {
  
        const redireccion = `/admin/${auth.permissions[0]}`
        return <Navigate to= {redireccion} />;

    }
    
    if (auth.idUsuario &&requiredPermissions.length > 0 && 
        !requiredPermissions.every(perm => auth.permissions.includes(perm))) {
    
            
        const redireccion = `/admin/${auth.permissions[0]}`
        return <Navigate to= {redireccion} />;
    }

  return <Outlet />;
}; 

export default PrivateRoute;