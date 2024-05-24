import React from "react";
import imagenesLanding from "../../assets/img/imagenesHome";

export const Inicio = () => {
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
                  <img className="img-fluid" src={imagenesLanding[1]} alt="Imagen slider" />
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
                      En SoftShirt, entfinemos que la creatividad es un fuego
                      que arde en cada uno de nosotros. Nos enorgullece ser el
                      puente entre tu yo artístico y el mundo, proporcionándote
                      la libertad para realizar obras maestras y llevarlas
                      contigo en forma de prfinas únicas.
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
                  <img className="img-fluid" src={imagenesLanding[2]} alt="Imagen slider" />
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
                      convierten en prfinas de moda.
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
                  <img className="img-fluid" src={imagenesLanding[3]} alt="Imagen slider" />
                </div>
                <div className="col-lg-6 mb-0 d-flex align-items-center">
                  <div className="text-align-left">
                    {/* <!-- <h1 className="h1">Repr in voluptate</h1> --> */}
                    <h3 className="h2">Mas que un diseño</h3>
                    <p>
                      Nuestras camisetas no son solo ropa; son un lienzo en
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
      <section className="bg-success py-5">
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
              <img src={imagenesLanding[4]} alt="Nosotros" width="320" height="" className="" />
            </div>
          </div>
        </div>
      </section>
      {/* fin nosotros */}

      {/* inicio servicios  */}
      <section className="container py-5">
        <div className="row text-center pt-5 pb-3">
          <div className="col-lg-6 m-auto">
            <h1 className="h1">Hechale un vistazo a nuestros servicios</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-lg-3 pb-5">
            <div className="h-100 py-5 services-icon-wap shadow">
              <div className="h1 text-success text-center">
                <i className="fa fa-truck fa-lg"></i>
              </div>
              <h2 className="h5 mt-4 text-center">Domicilios Área Metropolitana</h2>
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
        <div className="container my-4">
          <div className="row text-center py-3">
            <div className="col-lg-6 m-auto">
              {/* <!-- <h1 className="h1">Esto es lo que piensan nuestros clientes</h1> --> */}
              <h1 className="h1">Clientes Recientes</h1>
            </div>

            <div className="row">
              <div className="col-md-4">
                <img src={imagenesLanding[5]} className="" alt="Cliente 1" id="section-clientes" />
                <div className="card-body">
                  <p className="card-text">
                    Excelente servicio. ¡Los recomiendo totalmente!
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <img src={imagenesLanding[6]} className="" alt="Cliente 2" id="section-clientes" />
                <div className="card-body">
                  <p className="card-text">
                    Increíble experiencia. Estoy muy satisfecha con su trabajo.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <img src={imagenesLanding[7]} className="" alt="Cliente 3" id="section-clientes" />
                <div className="card-body">
                  <p className="card-text">
                    El personal es amable y profesional. Definitivamente
                    volveré.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* fin reseñas */}

      {/* inicio FAQs  */}

      <div className="accordion p-3" id="accordionExample">
        <h1 className="h1">Preguntas Frecuentes</h1>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button
              className="btn btn-link btn-block text-left"
              type="button"
              data-toggle="collapse"
              data-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              <strong>
                {" "}
                ¿Puedo personalizar una camiseta con mi propio diseño?
              </strong>
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-parent="#accordionExample"
          >
            <div className="accordion-body">
              <strong>
                Claro que si puedes personalizar tu propia camiseta,
              </strong>
              Utilizando nuestro personalizador de camisetas lo puedes lograr y
              dejar volar tu imaginacion.
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="btn  btn-block text-left collapsed"
              type="button"
              data-toggle="collapse"
              data-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              <strong>
                {" "}
                ¿Cuáles son las opciones de envío y cuánto tiempo tomará recibir
                mi pedido?
              </strong>
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionExample"
          >
            <div className="accordion-body">
              Normalmente nos demoramos en entregar el pedido a la puerta de tu
              casa alrededor de 5 días hábiles
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingThree">
            <button
              className="btn  btn-block text-left collapsed"
              type="button"
              data-toggle="collapse"
              data-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              <strong>¿Con cuantas camisetas puedo inicar un pedido?</strong>
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-parent="#accordionExample"
          >
            <div className="accordion-body">
              Para realizar un pedido solo debes comprar una camiseta y el
              límite de camisetas lo definira tu creatividad :).
            </div>
          </div>
        </div>
      </div>
      {/* fin FAQs  */}
    </>
  );
};
