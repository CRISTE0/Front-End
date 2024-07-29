import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import imagenesLanding from "../../assets/img/imagenesHome";

export const ProductoSolo = () => {
  const { id } = useParams();
  const [Producto, setProducto] = useState([]);
  const [ColorProducto, setColorProducto] = useState("");
  const [TallaProducto, setTallaProducto] = useState("");
  const url = `http://localhost:3000/api/productos/${id}`;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  let productoDetalle;

  const getProducto = async () => {
    const respuesta = await axios.get(url);

    const productData = respuesta.data;

    // Busca si el producto está en el carrito
    const itemInCart = cart.find(
      (item) => item.IdProd == productData.IdProducto
    );

    if (itemInCart) {
      // Si lo esta se agrega la cantidad seleccionada al producto
      productData.CantidadSeleccionada = itemInCart.CantidadSeleccionada;
    } else {
      // Si no esta se agrega la cantidad seleccionada en 0
      productData.CantidadSeleccionada = 0;
    }

    console.log(itemInCart);

    console.log(cart);

    setProducto(productData);
    productoDetalle = productData;

    console.log(productoDetalle);

    getColor();
    getTalla();
  };

  const getColor = async () => {
    const respuesta = await axios.get(
      `http://localhost:3000/api/colores/${productoDetalle.Insumo.IdColor}`
    );

    console.log(respuesta.data);

    setColorProducto(respuesta.data);
  };

  const getTalla = async () => {
    const respuesta = await axios.get(
      `http://localhost:3000/api/tallas/${productoDetalle.Insumo.IdTalla}`
    );

    console.log(respuesta.data);

    setTallaProducto(respuesta.data);
  };

  useEffect(() => {
    getProducto();
  }, [id]);

  if (!TallaProducto) {
    return <h1>Loading...</h1>;
  }

  //   Incrementar cantidad del carrito
  const incrementarCantidad = (idProductoSeleccionado) => {
    // Encuentra el índice del producto en el carrito
    const productIndex = cart.findIndex(
      (item) => item.IdProd == Producto.IdProducto
    );

    if (productIndex !== -1) {
      if (cart[productIndex].CantidadSeleccionada >= Producto.Cantidad) {
        show_alerta("Cantidad maxima del producto alcanzada", "error");
        return;
      }

      // Incrementa la cantidad del producto en el carrito
      cart[productIndex].CantidadSeleccionada += 1;

      // Actualiza el carrito en el localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      // Actualiza el estado del producto
      setProducto((prevProducto) => ({
        ...prevProducto,
        CantidadSeleccionada: prevProducto.CantidadSeleccionada + 1,
      }));

      getProducto();
    } else {
      // Si el producto no existe, agrégalo con una cantidad inicial de 1
      cart.push({ IdProd: Producto.IdProducto, CantidadSeleccionada: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));

      console.log(JSON.parse(localStorage.getItem("cart")));

      getProducto();
      // getCantidadProducto(idProductoSeleccionado);
    }
  };

  // Disminuir cantidad del carrito
  const disminuirCantidad = (idProductoSeleccionado, NombreDisenio) => {
    // let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Encuentra el índice del producto en el carrito
    const productIndex = cart.findIndex(
      (item) => item.IdProd == idProductoSeleccionado
    );

    if (productIndex !== -1) {
      if (cart[productIndex].CantidadSeleccionada > 1) {
        // Reduce la cantidad del producto si es mayor que 1
        cart[productIndex].CantidadSeleccionada -= 1;

        // Actualiza el carrito en el localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Actualiza el estado del producto
        setProducto((prevProducto) => ({
          ...prevProducto,
          CantidadSeleccionada: prevProducto.CantidadSeleccionada - 1,
        }));

        getProducto();

        console.log(cart);
      } else {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          title: `¿Seguro de eliminar el producto ${NombreDisenio} del carrito  ?`,
          icon: "question",
          text: "No se podrá dar marcha atrás",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
          showClass: {
            popup: "swal2-show",
            backdrop: "swal2-backdrop-show",
            icon: "swal2-icon-show",
          },
          hideClass: {
            popup: "swal2-hide",
            backdrop: "swal2-backdrop-hide",
            icon: "swal2-icon-hide",
          },
        }).then((result) => {
          // Si se confirma eliminar el producto
          if (result.isConfirmed) {
            // Elimina el producto del carrito si la cantidad es 1 y se intenta reducir más
            cart.splice(productIndex, 1);
            localStorage.setItem("cart", JSON.stringify(cart));

            // Actualiza el estado del carrito en React
            // setCartItems(prevCartItems => prevCartItems.filter(item => item.id !== idProductoSeleccionado));

            setProducto((prevProducto) => ({
              ...prevProducto,
              CantidadSeleccionada: (prevProducto.CantidadSeleccionada = 0),
            }));

            console.log(JSON.parse(localStorage.getItem("cart")));

            getProducto();

            show_alerta("El producto fue eliminado del carrito", "success");
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            show_alerta("El producto NO fue eliminado del carrito", "info");
          } else if (
            result.dismiss === Swal.DismissReason.backdrop ||
            result.dismiss === Swal.DismissReason.esc
          ) {
            show_alerta("El producto NO fue eliminado del carrito", "info");
          }
        });
      }
    }
  };

  // Funcion de alerta
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

  const botonComprarAhora = () => {
    if (Producto.CantidadSeleccionada == 0) {
      incrementarCantidad();
      navigate("/Carrito");
    } else {
      console.log("vagar");
      navigate("/Carrito");
    }
  };

  // Funcion para formatear el precio
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  };

  return (
    <>
      <link
        href="https://unpkg.com/ionicons@4.5.10-0/dist/css/ionicons.min.css"
        rel="stylesheet"
      ></link>
      {/* <!-- Open Content --> */}
      <section className="bg-light">
        <div className="container pb-5">
          <div className="row">
            <div className="col-lg-5 mt-5">
              {/* Imagen del producto */}
              <div className="card mb-3">
                {Producto.Disenio && (
                  <img
                    className="card-img img-fluid"
                    src={Producto.Disenio.ImagenReferencia}
                    alt={Producto.Disenio.NombreDisenio}
                  />
                )}
              </div>
            </div>

            {/* <!-- col end --> */}
            <div className="col-lg-7 mt-5">
              <div className="card">
                <div className="card-body">
                  {/* Nombre del producto */}
                  {Producto.Disenio && (
                    <h1 className="text-dark">
                      {Producto.Disenio.NombreDisenio}
                    </h1>
                  )}

                  {/* Referencia */}
                  <small className="font-weight-normal text-dark">
                    Referencia: {Producto.Referencia}
                  </small>

                  {/* Precio */}
                  <p className="h5 py-2 font-weight-bold text-dark">
                    {formatCurrency(Producto.ValorVenta)}
                  </p>

                  {/* 
                                <h6>Detalles:</h6>
                                <ul className="list-unstyled pb-3">
                                    <li>Producto:  Camiseta Estampada</li>
                                    <li>Técnica:  Sublimación</li>
                                    <li>Material: Algodón FTPt</li>
                                    <li>Sensación: Ultra Suave</li>
                                    <li>Genero: Unisex</li>
                                    
                                </ul> */}

                  <div>
                    <div className="row">
                      {/* Color del producto */}
                      <div className="col-12">
                        <ul className="list-inline ">
                          <li className="list-inline-item">Color:</li>

                          <li className="font-weight-bold text-dark">
                            {ColorProducto.Color}
                          </li>
                        </ul>
                      </div>

                      {/* Talla del producto */}
                      <div className="col-12">
                        <ul className="list-inline pb-1">
                          <li className="list-inline-item">Talla:</li>
                          <li className="font-weight-bold text-dark">
                            {TallaProducto.Talla}{" "}
                          </li>
                        </ul>
                      </div>

                      {/* Cantidad del producto */}
                      <div className="col-12">
                        <ul className="list-inline pb-3">
                          {Producto.CantidadSeleccionada > 0 && (
                            <li className="list-inline-item text-right">
                              Cantidad :
                            </li>
                          )}

                          <div className="d-flex flex-row align-items-center mt-2">
                            {/* Eliminar producto del carrito */}
                            {Producto.CantidadSeleccionada == 1 && (
                              <button
                                className="mr-3"
                                onClick={() =>
                                  disminuirCantidad(
                                    Producto.IdProducto,
                                    Producto.Disenio.NombreDisenio
                                  )
                                }
                                style={{
                                  width: "30px",
                                  border: "none",
                                  background: "transparent",
                                }}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            )}

                            {/* Disminuir cantidad del producto */}
                            {Producto.CantidadSeleccionada > 1 && (
                              <button
                                className="mr-3"
                                onClick={() =>
                                  disminuirCantidad(Producto.IdProducto)
                                }
                                style={{
                                  width: "30px",
                                  color: "black",
                                  border: "none",
                                  background: "transparent",
                                }}
                              >
                                <i className="fas fa-minus-circle"></i>
                              </button>
                            )}

                            {Producto.CantidadSeleccionada > 0 && (
                              <>
                                <div style={{ width: "40px" }}>
                                  <h5 className="mb-0">
                                    {Producto.CantidadSeleccionada}
                                  </h5>
                                </div>

                                {/* Aumentar cantidad del producto */}

                                <button
                                  className=""
                                  onClick={() => incrementarCantidad()}
                                  style={{
                                    border: "none",
                                    background: "transparent",
                                  }}
                                >
                                  <i className="fas fa-plus-circle"></i>
                                </button>
                              </>
                            )}
                          </div>
                        </ul>
                      </div>
                    </div>

                    {/* Detalles de la camiseta */}
                    <section>
                      <div className="container-accordion">
                        <div className="accordion">

                          {/* Item 1 */}
                          <div
                            className={`accordion-item ${
                              activeIndex === 0 ? "active" : ""
                            }`}
                          >
                            <div
                              className="accordion-link"
                              onClick={() => handleToggle(0)}
                            >
                              <div className="flex">
                                <h3>Información del producto</h3>
                              </div>
                              <i className="icon ion-md-arrow-forward"></i>
                              <i className="icon ion-md-arrow-down"></i>
                            </div>
                            <div className="answer">
                              <p>
                                ¡Los mejores planes con las mejores prendas!
                                Esta camiseta tiene todo lo que buscas en una
                                básica, mucho confort y estilo.
                              </p>
                              <h5>Características</h5>
                              <ul className="text-dark">
                                <li>Tacto suave</li>
                                <li>Manga corta</li>
                                <li>Cuello redondo</li>
                                <li>Estampado en sublimación</li>
                                {/* <li>Estampado en punto corazón</li> */}
                                <li>Material: Algodón 95% Elastano 5%</li>
                              </ul>
                              <p>
                                Una silueta tradicional con la que te moverás
                                confiado para conquistar el mundo.
                              </p>
                            </div>
                            <hr />
                          </div>

                          {/* Item 2 */}
                          <div
                            className={`accordion-item ${
                              activeIndex === 1 ? "active" : ""
                            }`}
                          >
                            <div
                              className="accordion-link"
                              onClick={() => handleToggle(1)}
                            >
                              <div className="flex">
                                <h3>Instrucciones de cuidado</h3>
                              </div>
                              <i className="icon ion-md-arrow-forward"></i>
                              <i className="icon ion-md-arrow-down"></i>
                            </div>
                            <div className="answer">
                              <img
                                src={imagenesLanding[8]}
                                alt="Cuidados de la prenda"
                              />
                              <p>
                                Para el cuidado de esta prenda te recomendamos
                                lavarla a mano a una temperatura máxima de 40°C,
                                evita usar blanqueador. No debes secarla en
                                máquina, ni retorcerla o exprimirla. Extiéndela
                                a la sombra. No es necesario plancharla. No la
                                limpies en seco, ni húmedo profesional.
                              </p>
                            </div>
                            <hr />
                          </div>

                          {/* Item 3 */}
                          <div
                            className={`accordion-item ${
                              activeIndex === 2 ? "active" : ""
                            }`}
                          >
                            <div
                              className="accordion-link"
                              onClick={() => handleToggle(2)}
                            >
                              <div className="flex">
                                <h3>Domicilios</h3>
                              </div>
                              <i className="icon ion-md-arrow-forward"></i>
                              <i className="icon ion-md-arrow-down"></i>
                            </div>
                            <div className="answer">
                              <p>
                                Tenemos domicilios 100% gratis en el área
                                metropolitana.
                              </p>
                            </div>
                            <hr />
                          </div>


                          {/* <div
                            className={`accordion-item ${
                              activeIndex === 3 ? "active" : ""
                            }`}
                          >
                            <div
                              className="accordion-link"
                              onClick={() => handleToggle(3)}
                            >
                              <div className="flex">
                                <h3>BACKEND DEVELOPMENT</h3>
                              </div>
                              <i className="icon ion-md-arrow-forward"></i>
                              <i className="icon ion-md-arrow-down"></i>
                            </div>
                            <div className="answer">
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut
                                enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo
                                consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum.
                              </p>
                            </div>
                            <hr />
                          </div> */}


                        </div>
                      </div>
                    </section>

                    <div className="d-flex justify-content-around pb-3">
                      <div className="">
                        <button
                          className="btn btn-success btn-lg"
                          onClick={() => botonComprarAhora()}
                        >
                          Comprar ahora
                        </button>
                      </div>

                      {Producto.CantidadSeleccionada == 0 && (
                        <div className="">
                          <button
                            className="btn btn-success btn-lg"
                            onClick={() =>
                              incrementarCantidad(Producto.IdProducto)
                            }
                          >
                            Agrega al carrito
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Close Content --> */}
    </>
  );
};
