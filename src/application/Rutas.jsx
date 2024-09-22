import React, { useState } from "react";
import Cookies from "js-cookie";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import {Inicio} from "../pages/Landing/Inicio";
import {Productos} from "../pages/Landing/Productos";
import {Contactenos} from "../pages/Landing/Contactenos";
import { Diseniador } from "../pages/Landing/Diseniador";
import { Login } from "../pages/Landing/Login";
import { Register } from "../pages/Landing/Register";
import { RecuperarContraseña } from "../pages/Landing/RecuperarContraseña";
import { LandingLayout } from "../layouts/LandingLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { Dashboard } from "../pages/Admin/Dashboard";
import { Configuracion } from "../pages/Admin/Configuracion";
import { Usuarios } from "../pages/Admin/Usuarios";
import { Proveedores } from "../pages/Admin/Proveedores";
import { Compras } from "../pages/Admin/Compras";
import { Catalogo} from "../pages/Admin/Productos";
import { Disenios } from "../pages/Admin/Disenios";
import { Clientes } from "../pages/Admin/Clientes";
import { Ventas } from "../pages/Admin/Ventas";
import { Pedidos } from "../pages/Admin/Pedidos";
import { Tallas } from "../pages/Admin/Tallas";
import { Colores } from "../pages/Admin/Colores";
import { Carrito } from "../pages/Landing/Carrito";
import { Insumos } from "../pages/Admin/Insumos"
import { ProductoSolo } from "../pages/Landing/ProductoSolo";
import { LoginAdmin } from "../pages/Landing/LoginAdmin";

import PrivateRoute from "./PrivateRoute";
import { ConfirmarContrasenia } from "../pages/Landing/ConfirmarContraseña";
import { RecuperarContraseñaUsuario } from "../pages/Landing/RecuperarContraseñaUsuario";
import { ConfirmarContraseniaUsuario } from "../pages/Landing/ConfirmarContraseñaUsuario";
import PublicRoute from "./PublicRoute";
import Pages404 from "../components/404/404";
import { ActualizarDatos } from "../pages/Admin/ActualizarDatos";

export const Rutas = () => {



  return (
    <HashRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route exat path="/" element={ <LandingLayout> <Inicio /> </LandingLayout> } />
        <Route path="/Productos" element={ <LandingLayout> <Productos /> </LandingLayout>  } />
        <Route path="/Contactenos" element={ <LandingLayout> <Contactenos /> </LandingLayout> } />
        <Route path="/Diseniador" element={ <LandingLayout> <Diseniador /> </LandingLayout> } />


        <Route path="/Register" element={ <LandingLayout> <Register /> </LandingLayout> } />
        <Route path="/RecuperarContraseña" element={ <LandingLayout> <RecuperarContraseña /> </LandingLayout> } />        
        <Route path="/ProductoSolo/:id" element={ <LandingLayout> <ProductoSolo /> </LandingLayout>  } />


        <Route path="/RecuperarCliente" element={ <LandingLayout> <RecuperarContraseña /> </LandingLayout> } />

        <Route path="/ConfirmarConstrasenia/:cookieParams" element={()=> <LandingLayout> <ConfirmarContrasenia /> </LandingLayout> } />


        <Route path="/RecuperarUsuario" element={ <LandingLayout> <RecuperarContraseñaUsuario /> </LandingLayout> } />

        <Route path="/ConfirmarConstraseniaUsuario/:cookieParams" element={ <LandingLayout> <ConfirmarContraseniaUsuario /> </LandingLayout> } />

        <Route path="/ActualizarDatos/:id" element={ <ActualizarDatos />  } />


        {/* <Route element={<PrivateRoute requiredPermissions={["ProductoSolo"]}/>}> 

        </Route> */}

        <Route element={<PublicRoute />}> 
          <Route path="/Login" element={ <LandingLayout> <Login /> </LandingLayout> } />
        </Route>


        <Route element={<PublicRoute/>}> 
        <Route path="/admin/Login" element={ <LandingLayout> < LoginAdmin/> </LandingLayout> } />
        </Route>


        
        {/* Rutas privadas */}


        <Route element={<PrivateRoute requiredPermissions={["Carrito"]}/>}> 
          <Route path="/Carrito" element={ <LandingLayout> <Carrito /> </LandingLayout>  } />
        </Route>

        {/* cuando la ruta sea solo admin, lo rediriga a algun permiso que tenga el usuario  */}
        <Route element={<PrivateRoute requiredPermissions={["siu"]}/>}> 
          <Route path="/admin" element={ <AdminLayout> <Dashboard /> </AdminLayout>  } />
        </Route>        

        <Route element={<PrivateRoute requiredPermissions={["Dashboard"]}/>}> 
          <Route path="/admin/Dashboard" element={ <AdminLayout> <Dashboard /> </AdminLayout>  } />
        </Route>

        <Route element={<PrivateRoute requiredPermissions={["Configuración"]}/>}> 
          <Route path="/admin/Configuracion" element={ <AdminLayout> <Configuracion /> </AdminLayout> } />
        </Route>

        
        <Route element={<PrivateRoute requiredPermissions={["Usuarios"]}/>}> 
          <Route path="/admin/Usuarios" element={ <AdminLayout> <Usuarios /> </AdminLayout> } />
        </Route>


        <Route element={<PrivateRoute requiredPermissions={["Proveedores"]}/>}> 
          <Route path="/admin/Proveedores" element={ <AdminLayout> <Proveedores /> </AdminLayout> } />
        </Route>

        <Route element={<PrivateRoute requiredPermissions={["Insumos"]}/>}> 
          <Route path="/admin/Insumos" element={ <AdminLayout> <Insumos /> </AdminLayout> } />
        </Route>

        <Route element={<PrivateRoute requiredPermissions={["Tallas"]}/>}> 
          <Route path="/admin/Tallas" element={ <AdminLayout> <Tallas /> </AdminLayout> } />
        </Route>

        <Route element={<PrivateRoute requiredPermissions={["Colores"]}/>}> 
          <Route path="/admin/Colores" element={ <AdminLayout> <Colores /> </AdminLayout> } />
        </Route>

        <Route element={<PrivateRoute requiredPermissions={["Compras"]}/>}> 
          <Route path="/admin/Compras" element={ <AdminLayout> <Compras /> </AdminLayout> } />
        </Route>

        <Route element={<PrivateRoute requiredPermissions={["Productos"]}/>}> 
          <Route path="/admin/Productos" element={ <AdminLayout> <Catalogo /> </AdminLayout> } />
        </Route>


        
        <Route element={<PrivateRoute requiredPermissions={["Diseños"]}/>}> 
          <Route path="/admin/Disenios" element={ <AdminLayout> <Disenios /> </AdminLayout> } />
        </Route>

        
        <Route element={<PrivateRoute requiredPermissions={["Clientes"]}/>}> 
          <Route path="/admin/Clientes" element={ <AdminLayout> <Clientes /> </AdminLayout> } />
        </Route>

        
        <Route element={<PrivateRoute requiredPermissions={["Ventas"]}/>}> 
          <Route path="/admin/Ventas" element={ <AdminLayout> <Ventas /> </AdminLayout> } />
        </Route>

        
        <Route element={<PrivateRoute requiredPermissions={["Pedidos"]}/>}> 
          <Route path="/admin/Pedidos" element={ <AdminLayout> <Pedidos /> </AdminLayout> } />
        </Route>



        <Route path="*" element={<Pages404 />} />
        <Route path="/unauthorized" element={ <h1>pa onde papi, 🐸 HP</h1>} />
        
      </Routes>
    </HashRouter>
  );
};


