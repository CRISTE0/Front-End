import React, { useState } from "react";
import imagenesLanding from "../../assets/img/imagenesHome";

export const Inicio = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      {/* <!-- inicio Banner Hero --> */}
      <div
        id="template-mo-zay-hero-carousel"
        className="carousel slide"
        data-ride="carousel"
      >
        <ol className="carousel-indicators">
          <li
            data-target="#template-mo-zay-hero-carousel"
            data-slide-to="0"
            className="active"
          ></li>
          <li
            data-target="#template-mo-zay-hero-carousel"
            data-slide-to="1"
          ></li>
          <li
            data-target="#template-mo-zay-hero-carousel"
            data-slide-to="2"
          ></li>
        </ol>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="container">
              <div className="row p-5">
                <div className="mx-auto col-md-8 col-lg-6 order-lg-last">
                  <img
                    className="img-fluid p-4"
                    src={imagenesLanding[1]}
                    alt="Imagen slider"
                  />
                </div>
                <div className="col-lg-6 mb-0 d-flex align-items-center">
                  <div className="text-align-left align-self-center">
                    <h1 className="h1 text-success ">
                      <b>Bienvenid@s</b> a SoftShirt
                    </h1>
                    <h3 className="h2">
                      El sitio ideal para liberar tu creatividad
                    </h3>
                    <p>
                      En SoftShirt, entendemos que la creatividad es un fuego
                      que arde en cada uno de nosotros. Nos enorgullece ser el
                      puente entre tu yo artístico y el mundo, proporcionándote
                      la libertad para realizar obras maestras y llevarlas
                      contigo en forma de prendas únicas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="container">
              <div className="row p-5">
                <div className="mx-auto col-md-8 col-lg-6 order-lg-last">
                  <img
                    className="img-fluid p-4"
                    src={imagenesLanding[2]}
                    alt="Imagen slider"
                  />
                </div>
                <div className="col-lg-6 mb-0 d-flex align-items-center">
                  <div className="text-align-left">
                    <h2 className="h2 m-3">Mas que una tela</h2>
                    {/* <!-- <h3 className="h2">Aliquip ex ea commodo consequat</h3> --> */}
                    <p>
                      Imagina una tela en blanco que se convierte en tu lienzo,
                      una camiseta que se transforma en tu expresión artística.
                      Con nosotros, puedes desatar todo tu potencial creativo,
                      sin restricciones. Te ofrecemos una plataforma donde tus
                      ideas se convierten en diseños, y esos diseños se
                      convierten en prendas de moda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="container">
              <div className="row p-5">
                <div className="mx-auto col-md-8 col-lg-6 order-lg-last">
                  <img
                    className="img-fluid p-4"
                    src={imagenesLanding[3]}
                    alt="Imagen slider"
                  />
                </div>
                <div className="col-lg-6 mb-0 d-flex align-items-center ">
                  <div className="text-align-left">
                    {/* <!-- <h1 className="h1">Repr in voluptate</h1> --> */}
                    <h3 className="h2">Mas que un diseño</h3>
                    <p>
                      Nuestras camisetas no son solo ropa, son un lienzo en
                      blanco para tus pensamientos,emociones y pasiones.
                      Queremos que te sientas inspirado y seguro de que tus
                      ideas pueden cobrar vida y que, al llevarlas, compartes
                      una parte de ti con el mundo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a
          className="carousel-control-prev text-decoration-none w-auto ps-3"
          href="#template-mo-zay-hero-carousel"
          role="button"
          data-slide="prev"
        >
          <i className="fas fa-chevron-left"></i>
        </a>
        <a
          className="carousel-control-next text-decoration-none w-auto pe-3"
          href="#template-mo-zay-hero-carousel"
          role="button"
          data-slide="next"
        >
          <i className="fas fa-chevron-right"></i>
        </a>
      </div>
      {/* fin Banner Hero */}

      {/* inicio nosotros  */}
      <section className="bg-success py-5" id="sobreNosotros">
        <div className="container">
          <div className="row align-items-center py-5">
            <div className="col-md-8 text-white">
              <h1>Sobre Nosotros</h1>
              <p>
                Nosotros somos la esencia de la moda y la creatividad. En cada
                puntada, cada diseño y cada prfina, te ofrecemos nuestra pasión
                por la excelencia y la innovación. Nuestra microempresa está
                impulsada por el deseo de brindarte lo mejor de la moda actual y
                las creaciones únicas que amarás. Únete a nuestra historia y
                descubre un mundo de estilo y originalidad.
              </p>
            </div>
            <div className="col-md-4 p-1">
              <img
                src={imagenesLanding[4]}
                alt="Nosotros"
                width="320"
                height=""
                className=""
              />
            </div>
          </div>
        </div>
      </section>
      {/* fin nosotros */}

      {/* inicio servicios  */}
      <section className="container py-5" id="servicios">
        <div className="row text-center pt-5 pb-3">
          <div className="col-lg-6 m-auto">
            <h1 className="h1">Hechale un vistazo a nuestros servicios</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-lg-3 pb-5">
            <div className="h-100 py-5 services-icon-wap shadow">
              <div className="h1 text-success text-center">
                <i className="fa fa-shipping-fast fa-lg"></i>
              </div>
              <h2 className="h5 mt-4 text-center">
                Domicilios Área Metropolitana
              </h2>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 pb-5">
            <div className="h-100 py-5 services-icon-wap shadow">
              <div className="h1 text-success text-center">
                <i className="fas fa-store"></i>
              </div>
              <h2 className="h5 mt-4 text-center">Tienda Online</h2>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 pb-5">
            <div className="h-100 py-5 services-icon-wap shadow">
              <div className="h1 text-success text-center">
                <i className="fa fa-percent"></i>
              </div>
              <h2 className="h5 mt-4 text-center">
                Ventas al Detal y al por Mayor
              </h2>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 pb-5">
            <div className="h-100 py-5 services-icon-wap shadow">
              <div className="h1 text-success text-center">
                <i className="fa fa-user"></i>
              </div>
              <h2 className="h5 mt-4 text-center">Atención Personalizada</h2>
            </div>
          </div>
        </div>
      </section>
      {/* fin servicios  */}

      {/* inicio reseñas  */}
      <section className="bg-light py-2">
        <div className="container overflow-hidden p-3">
          <div className="container d-flex justify-content-center">
            <h1 className="h1 text-dark pb-4">Clientes Recientes</h1>
          </div>

          <div className="row gy-4 gy-md-0 gx-xxl-5">
            <div className="col-12 col-md-4 p-2">
              <div
                className="card shadow-sm"
                style={{ borderBottom: " 1px solid #1cc88a" }}
              >
                <div className="card-body p-4 ">
                  <figure>
                    <img
                      className="img-fluid rounded rounded-circle mb-4 "
                      style={{ border: "1px solid #1cc88a" }}
                      src={imagenesLanding[5]}
                      alt="Luna John"
                    />
                    <figcaption>
                      <blockquote className="bsb-blockquote-icon mb-4">
                        La camiseta estampada que compré superó todas mis
                        expectativas. El diseño es vibrante y los colores son
                        tan vivos como los mostraban en la tienda. ¡Me encanta
                        cómo se siente la tela! Sin duda, volveré a comprar
                        aquí.
                      </blockquote>
                      <h4 className="mb-2 text-dark">Juan Flórez</h4>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4 p-2">
              <div
                className="card shadow-sm"
                style={{ borderBottom: " 1px solid #1cc88a" }}
              >
                <div className="card-body p-4 p-xxl-5">
                  <figure>
                    <img
                      className="img-fluid rounded rounded-circle mb-4 "
                      style={{ border: "1px solid #1cc88a" }}
                      src={imagenesLanding[6]}
                      alt="Mark Smith"
                    />
                    <figcaption>
                      <blockquote className="bsb-blockquote-icon mb-4">
                        La atención al detalle en el estampado es increíble. La
                        camiseta no solo es cómoda, sino que también mantiene su
                        forma después de varios lavados. Estoy muy contenta con
                        mi compra y con la calidad del servicio.
                      </blockquote>
                      <h4 className="mb-2 text-dark">Luna García</h4>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4 p-2">
              <div
                className="card shadow-sm"
                style={{ borderBottom: " 1px solid #1cc88a" }}
              >
                <div className="card-body p-4 p-xxl-5">
                  <figure>
                    <img
                      className="img-fluid rounded rounded-circle mb-4 "
                      style={{ border: "1px solid #1cc88a" }}
                      src={imagenesLanding[7]}
                      alt="Luke Reeves"
                    />
                    <figcaption>
                      <blockquote className="bsb-blockquote-icon mb-4">
                        ¡Estoy encantado con mi nueva camiseta estampada! El
                        proceso de compra fue sencillo y el producto llegó
                        rápidamente. La calidad del material es excelente y el
                        estampado se ve genial. Definitivamente, recomendaré
                        esta tienda a mis amigos.
                      </blockquote>
                      <h4 className="mb-2 text-dark">Jhon Sánchez </h4>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* fin reseñas */}


      {/* inicio FAQs  */}
      <section id="faqs">
        <div className="container m-4">
          <h1 className="d-flex justify-content-center mt-3 text-dark">
            Preguntas Frecuentes
          </h1>
          <div className="parent-container mt-5">
            <ul className="faq">
              <li className={activeIndex === 0 ? "active" : ""}>
                <h3 className="question" onClick={() => toggleFAQ(0)}>
                ¿Puedo personalizar una camiseta con mi propio diseño?
                  <div
                    className={`plus-minus-toggle ${
                      activeIndex === 0 ? "" : "collapsed"
                    }`}
                  ></div>
                </h3>
                <div
                  className="answer"
                  style={{
                    maxHeight: activeIndex === 0 ? "275px" : "0",
                    paddingBottom: activeIndex === 0 ? "25px" : "0",
                    overflow: "hidden",
                    transition:
                      "max-height 0.5s ease, padding-bottom 0.5s ease",
                  }}
                >
                  <strong>
                  Claro que si puedes personalizar tu propia camiseta,
                </strong>
                Utilizando nuestro personalizador de camisetas lo puedes lograr y
                dejar volar tu imaginacion.
                </div>
              </li>

              <li className={activeIndex === 1 ? "active" : ""}>
                <h3 className="question" onClick={() => toggleFAQ(1)}>
                ¿Cuánto tiempo tomará en llegar mi pedido?
                  <div
                    className={`plus-minus-toggle ${
                      activeIndex === 1 ? "" : "collapsed"
                    }`}
                  ></div>
                </h3>
                <div
                  className="answer"
                  style={{
                    maxHeight: activeIndex === 1 ? "275px" : "0",
                    paddingBottom: activeIndex === 1 ? "25px" : "0",
                    overflow: "hidden",
                    transition:
                      "max-height 0.5s ease, padding-bottom 0.5s ease",
                  }}
                >
                  Normalmente nos demoramos en entregar el pedido a la puerta de tu
                  casa alrededor de 5 días hábiles
                </div>
              </li>

              <li className={activeIndex === 2 ? "active" : ""}>
                <h3 className="question" onClick={() => toggleFAQ(2)}>
                ¿Con cuantas camisetas puedo inicar un pedido?
                  <div
                    className={`plus-minus-toggle ${
                      activeIndex === 2 ? "" : "collapsed"
                    }`}
                  ></div>
                </h3>
                <div
                  className="answer"
                  style={{
                    maxHeight: activeIndex === 2 ? "275px" : "0",
                    paddingBottom: activeIndex === 2 ? "25px" : "0",
                    overflow: "hidden",
                    transition:
                      "max-height 0.5s ease, padding-bottom 0.5s ease",
                  }}
                >
                   Para realizar un pedido solo debes comprar una camiseta y el
                   límite de camisetas lo definira tu creatividad :) .
                </div>
              </li>
            </ul>
          </div>
        </div>

      </section>

      {/* fin FAQs  */}
    </>
  );
};
