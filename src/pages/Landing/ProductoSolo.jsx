import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import imagenesLanding from "../../assets/img/imagenesHome";
import { useAuth } from "../../context/AuthProvider";
import show_alerta from "../../components/Show_Alerta/show_alerta";
export const ProductoSolo = () => {
  const { id } = useParams();
  const [Producto, setProducto] = useState([]);
  const [ColorProducto, setColorProducto] = useState("");
  const [TallaProducto, setTallaProducto] = useState("");

  const [Colores, setColores] = useState([]); // Colores disponibles
  const [Tallas, setTallas] = useState([]); // Tallas disponibles
  const [TallaSeleccionada, setTallaSeleccionada] = useState(""); // Talla seleccionada
  const [ColorSeleccionado, setColorSeleccionado] = useState(""); // Color seleccionado
  const [TallasDisponibles, setTallasDisponibles] = useState([]);
  const [ColoresDisponibles, setColoresDisponibles] = useState([]);
  const [InsumoSeleccionado, setInsumoSeleccionado] = useState(null);

  const { triggerRender } = useAuth();
  const { auth } = useAuth();
  const url = `https://softshirt-1c3fad7d72e8.herokuapp.com/api/productos/${id}`;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  let productoDetalle;

  const getProducto = async () => {
    const respuesta = await axios.get(url);

    // repuesta de la peticion 
    const productData = respuesta.data;

    // Busca si el producto está en el carrito
    const itemInCart = cart.find(
      (item) => item.IdProd == productData.IdProducto
    );

    // la CantidadSeleccionada es solo mientras está en esta pagina  
    if (itemInCart) {
      // Si lo esta se agrega la cantidad seleccionada al producto
      productData.CantidadSeleccionada = itemInCart.CantidadSeleccionada;
    } else {
      // Si no esta se agrega la cantidad seleccionada en 0
      productData.CantidadSeleccionada = 0;
    }

    console.log(itemInCart);
    console.log(cart);

    // Filtrar insumos con cantidad mayor a 0
    const productoInsumosDisponibles = productData.ProductoInsumos.filter(
      (insumo) => insumo.CantidadProductoInsumo > 0
    );

    console.log(productoInsumosDisponibles);
    

    setProducto({ ...productData, ProductoInsumos: productoInsumosDisponibles });

    productoDetalle = productData;

    console.log(productoDetalle);

    // Filtrar tallas y colores únicos basados en los insumos disponibles
    const tallas = [
      ...new Set(
        productoInsumosDisponibles.map((insumo) => insumo.InsumoProd.Talla.Talla)
      ),
    ];
    const colores = [
      ...new Set(
        productoInsumosDisponibles.map((insumo) => insumo.InsumoProd.Color.Color)
      ),
    ];

    setTallasDisponibles(tallas);
    setColoresDisponibles(colores);

  };

  // Manejar la selección de la talla
  const handleTallaSeleccionada = (talla) => {
    setTallaSeleccionada(talla);

    // Filtrar colores disponibles según la talla seleccionada
    const coloresParaTalla = Producto.ProductoInsumos.filter(
      (insumo) => insumo.InsumoProd.Talla.Talla === talla && insumo.CantidadProductoInsumo > 0
    ).map((insumo) => insumo.InsumoProd.Color.Color);

    setColoresDisponibles([...new Set(coloresParaTalla)]);
    setColorSeleccionado(null); // Reiniciar color al cambiar talla
    setInsumoSeleccionado(null); // Reiniciar insumo al cambiar talla

  };


  // Manejar la selección del color
  const handleColorSeleccionado = (color) => {
    setColorSeleccionado(color);

     // Filtrar el insumo seleccionado con la combinación de talla y color
     const insumo = Producto.ProductoInsumos.find(
      (insumo) =>
        insumo.InsumoProd.Talla.Talla === TallaSeleccionada &&
        insumo.InsumoProd.Color.Color === color
    );

    setInsumoSeleccionado(insumo);
  };


  const getColor = async () => {
    const respuesta = await axios.get(
      `https://softshirt-1c3fad7d72e8.herokuapp.com/api/colores/${productoDetalle.Insumo.IdColor}`
    );

    console.log(respuesta.data);

    setColorProducto(respuesta.data);
  };

  const getTalla = async () => {
    const respuesta = await axios.get(
      `https://softshirt-1c3fad7d72e8.herokuapp.com/api/tallas/${productoDetalle.Insumo.IdTalla}`
    );

    console.log(respuesta.data);

    setTallaProducto(respuesta.data);
  };

  useEffect(() => {
    getProducto();
  }, [id]);


  // Incrementar cantidad del carrito
  const incrementarCantidad = (idProductoSeleccionado) => {
    // Filtrar el insumo seleccionado en base a la talla y color seleccionados
    const insumoSeleccionado = Producto.ProductoInsumos.find(
      (insumo) =>
        insumo.InsumoProd.Talla.Talla === TallaSeleccionada &&
        insumo.InsumoProd.Color.Color === ColorSeleccionado
    );

    // Si no se encuentra un insumo que coincida con la talla y color seleccionados
    if (!insumoSeleccionado) {
      show_alerta({message:"Insumo no encontrado para la talla y color seleccionados", type:"error"});
      return;
    }

    // Encuentra el índice del producto en el carrito
    const productIndex = cart.findIndex(
      (item) => item.IdIns == insumoSeleccionado.InsumoProd.IdInsumo
    );

    console.log(insumoSeleccionado);

    // Si encuentra el producto en el carrito
    if (productIndex !== -1) {
      // Validación de la cantidad disponible
      if (cart[productIndex].CantidadSeleccionada >= insumoSeleccionado.CantidadProductoInsumo) {
        show_alerta({message: "Cantidad máxima del producto alcanzada", type:"error"});
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
      triggerRender();
      show_alerta({message:"Producto agregado al carrito correctamente ", type:"success"});
    
    } else {
      // Si el producto no existe en el carrito, agrégalo con una cantidad inicial de 1
      cart.push({
        IdProd: Producto.IdProducto,
        CantidadSeleccionada: 1,
        IdIns: insumoSeleccionado.InsumoProd.IdInsumo,
      });
      localStorage.setItem("cart", JSON.stringify(cart));

      console.log(JSON.parse(localStorage.getItem("cart")));

      show_alerta({message:"Producto agregado al carrito correctamente ", type:"success"});


      getProducto();
      triggerRender();
    }

    // Deselecciona los botones de talla y color al agregar al carrito
    setTallaSeleccionada(null);
    setColorSeleccionado(null);

    // navigate("/Carrito");
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

                  <div>
                    {auth.idCliente &&(

                    <div className="row">
                      {/* Color del producto */}

                      {/* Talla del producto */}
                      <div className="col-12 pb-3">

                        <h6>Selecciona una talla:</h6>
                        {TallasDisponibles.map((talla, index) => (
                        <button
                          key={index}
                          className={`btn mx-1 my-1 btn-sm ${
                            TallaSeleccionada === talla
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={() => handleTallaSeleccionada(talla)}
                        >
                          {talla}
                        </button>
                      ))}
                      </div>

                      <div className="col-12 pb-5">
                        <h6>Selecciona un color:</h6>
                        {ColoresDisponibles.map((color, index) => (
                          <button
                            key={index}
                            className={`btn mx-1 my-1 btn-sm ${
                              ColorSeleccionado === color
                                ? "btn-success"
                                : "btn-outline-success"
                            }`}
                            onClick={() => handleColorSeleccionado(color)}
                            disabled={!TallaSeleccionada}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                      
                    </div>
                    )}


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

                    <div className="d-flex justify-content-around m-4">
                      

                      {auth.idCliente && (
                        <div className="">
                          <button
                            className="btn btn-success btn-md"
                            disabled={!TallaSeleccionada || !ColorSeleccionado}

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
