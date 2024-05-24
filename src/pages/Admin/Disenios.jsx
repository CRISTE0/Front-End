import React from 'react'
import imagenesAdmin from '../../assets/img/imagenesAdmin'

export const Disenios = () => {
  return (
    <>

{/* <!-- camisas añadidas por los Usuarios --> */}

<div className="container-fluid">
  <h3 className="text-dark">Diseños de @username</h3>
  <div className="row">
    <div className="col-md-3">
      <div className="card mb-4 product-wap rounded-0">
        <div className="card rounded-0">
          <img
            className="card-img rounded-0 img-fluid"
            src={imagenesAdmin[0]}
            alt="Diseño #1"
          />
        </div>
        <div className="card-body">
          <p className="text-dark mb-0">Diseño #1</p>
          <div className="d-flex justify-content-between mt-3">
            <button type="button" className="btn btn-danger">
              <i className="fas fa-trash"></i> Eliminar
            </button>
            <button type="button" className="btn btn-primary ml-2">
              <i className="fas fa-shopping-cart"></i> Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
    {/* <!-- Agrega más diseños según sea necesario --> */}
  </div>
</div>


    </>
  )
}

