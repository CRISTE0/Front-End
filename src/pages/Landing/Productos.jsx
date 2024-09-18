import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Loader from "../../components/Loader/loader";
import { useNavigate } from "react-router-dom";
import show_alerta from "../../components/Show_Alerta/show_alerta";

import { useAuth } from "../../context/AuthProvider";

export const Productos = () => {
  const url = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/productos";

  const [Productos, setProductos] = useState([]);

  const { auth } = useAuth();

  const { triggerRender } = useAuth();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleViewProduct = (idProducto) => {
    setLoading(true); // Mostrar loader
    setTimeout(() => {
      navigate(`/ProductoSolo/${idProducto}`);
    }, 1000); // Espera un poco para que se vea el loader
  };

  const getProductos = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      const respuesta = await axios.get(url);
      const productosActivos = respuesta.data.filter(
        (producto) => producto.Publicacion === "Activo"
      );
      setProductos(productosActivos);
      console.log(respuesta.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      // Puedes agregar un manejo de errores más específico, como una alerta o mensaje para el usuario
      show_alerta({
        message: "Error al cargar los productos",
        type: "error",
      });
    } finally {
      setLoading(false); // Mostrar el loader antes de realizar la solicitud
    }
  };

  const getCantidadProducto = (productId) => {
    const item = cart.find((item) => item.IdProd == productId);

    // Si encuentra el producto lo devuelve con la cantidad seleccionada
    return item ? item.CantidadSeleccionada : 0;
  };

  const addToCart = (idProductoSeleccionado, cantidadProductoDisponible) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Verifica si el producto ya existe en el carrito
    const existingProductIndex = cart.findIndex(
      (item) => item.IdProd === idProductoSeleccionado
    );

    if (existingProductIndex !== -1) {
      if (
        cart[existingProductIndex].CantidadSeleccionada >=
        cantidadProductoDisponible
      ) {
        show_alerta({
          message: "Cantidad maxima del producto alcanzada",
          type: "error",
        });
        return;
      } else {
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

    localStorage.setItem("cart", JSON.stringify(cart));
    triggerRender();

    console.log(JSON.parse(localStorage.getItem("cart")));
  };

  // Funcion para formatear el precio
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  };

  useEffect(() => {
    getProductos();
  }, []);

  if (loading) {
    return <Loader />;
  }

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
                            <button
                              className="btn btn-success text-white mt-2"
                              onClick={() =>
                                handleViewProduct(producto.IdProducto)
                              }
                            >
                              <i className="far fa-eye"></i>
                            </button>
                          </li>

                          {/* Agregar el producto al carrito */}
                          {/* {auth.idCliente &&(
                          <li>
                            <a
                              className="btn btn-success text-white mt-2"
                              onClick={() => addToCart(producto.IdProducto,producto.Cantidad)}
                            >
                              <i className="fas fa-cart-plus"></i>
                            </a>
                          </li>

                          )} */}
                        </ul>
                      </div>
                    </div>

                    <div className="card-body d-flex flex-column justify-content-between">
                      <p className="h3 text-decoration-none">
                        {producto.Disenio.NombreDisenio}
                      </p>

                      {/* {getCantidadProducto(producto.IdProducto) !== 0 &&(
                        <p>Cantidad Seleccionada : {getCantidadProducto(producto.IdProducto)} </p>
                      )} */}

                      <p className="text-center mb-0">
                        {formatCurrency(producto.ValorVenta)}
                      </p>
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
