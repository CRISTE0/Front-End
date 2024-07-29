import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";


import imagenesProductos from "../../assets/img/camisetas";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";


export const Productos = () => {
  
  const url = "http://localhost:3000/api/productos";

  const [Productos, setProductos] = useState([]);

  
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  
  const getProductos = async () => {
    const respuesta = await axios.get(url);
    const productosActivos = respuesta.data.filter(
      (producto) => producto.Publicacion === "Activo"
    );
    setProductos(productosActivos);
    console.log(respuesta.data);
    
  };


  const getCantidadProducto = (productId) => {
  
    const item = cart.find(item => item.IdProd == productId);
    
    // Si encuentra el producto lo devuelve con la cantidad seleccionada
    return item ? item.CantidadSeleccionada : 0;
  };
  
  const addToCart = (idProductoSeleccionado,cantidadProductoDisponible) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Verifica si el producto ya existe en el carrito
    const existingProductIndex = cart.findIndex(item => item.IdProd === idProductoSeleccionado);
  
    if (existingProductIndex !== -1) {
      if (cart[existingProductIndex].CantidadSeleccionada >= cantidadProductoDisponible) {
        show_alerta("Cantidad maxima del producto alcanzada","error")
        return;

      }else{
        
        // Si el producto existe y no supera la cantidad del producto, incrementa la cantidad
        cart[existingProductIndex].CantidadSeleccionada += 1;
        getProductos();
        getCantidadProducto(idProductoSeleccionado);
      }

    } else {
      // Si el producto no existe, agrégalo con una cantidad inicial de 1
      cart.push({ IdProd: idProductoSeleccionado, CantidadSeleccionada: 1 });
      
      getProductos();
      getCantidadProducto(idProductoSeleccionado);
    
    }
  
    localStorage.setItem('cart', JSON.stringify(cart));

    console.log(JSON.parse(localStorage.getItem("cart")));
  };


  const show_alerta = (message, type) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: message,
      icon: type,
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
      didOpen: () => {
        // Selecciona la barra de progreso y ajusta su estilo
        const progressBar = MySwal.getTimerProgressBar();
        if (progressBar) {
          progressBar.style.backgroundColor = "black";
          progressBar.style.height = "6px";
        }
      },
    });
  };
  
  // Funcion para formatear el precio
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  }

  useEffect(() => {
    getProductos();
  }, []);

  return (
    <>
      {/* <!-- Start Content --> */}
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-15">
            <div className="row">

              {Productos.map((producto) => (
             
                <div key={producto.IdProducto} className="col-md-4">
                  <div className="card mb-4 product-wap rounded-0 d-flex">
                    <div className="card rounded-0">
                      <img
                        className="card-img img-fluid custom-image"
                        src={producto.Disenio.ImagenReferencia}
                      />
                      <div className="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                        <ul className="list-unstyled">

                          {/* Ver detalle del producto */}
                         <li>
                           <Link to={(`/ProductoSolo/${producto.IdProducto}`)} className="btn btn-success text-white mt-2"
                           > 
                              <i className="far fa-eye"></i>
                            </Link>
                          </li>

                          {/* Agregar el producto al carrito */}
                          <li>
                            <a
                              className="btn btn-success text-white mt-2"
                              onClick={() => addToCart(producto.IdProducto,producto.Cantidad)}
                            >
                              <i className="fas fa-cart-plus"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="card-body d-flex flex-column justify-content-between">
                      <p
                        className="h3 text-decoration-none"
                      >
                        {producto.Disenio.NombreDisenio}
                      </p>

                      {getCantidadProducto(producto.IdProducto) !== 0 &&(
                        <p>Cantidad Seleccionada : {getCantidadProducto(producto.IdProducto)} </p>
                      )}

                      <p className="text-center mb-0">{formatCurrency(producto.ValorVenta)}</p>
                    </div>

                  </div>

                </div>

              ))}

              </div>
            {/* <!--                 
                <div div="row">
                    <ul className="pagination pagination-lg justify-content-end">
                        <li className="page-item disabled">
                            <a className="page-link active rounded-0 mr-3 shadow-sm border-top-0 border-left-0" href="#"
                                tabindex="-1">1</a>
                        </li>
                        <li className="page-item">
                            <a className="page-link rounded-0 mr-3 shadow-sm border-top-0 border-left-0 text-dark"
                                href="#">2</a>
                        </li>
                        <li className="page-item">
                            <a className="page-link rounded-0 shadow-sm border-top-0 border-left-0 text-dark" href="#">3</a>
                        </li>
                    </ul>
                </div> --> */}
          </div>
        </div>
      </div>
      {/* <!-- End Content --> */}
    </>
  );
};
