import React from 'react'

import imagenesProductos from '../../assets/img/camisetas';

export const Productos = () => {
  return (
    <>


    
{/* <!-- Start Content --> */}
    <div className="container py-5">
        <div className="row">
            <div className="col-lg-15">
                <div className="row">
                    {/* <!-- producto unico --> */}
                    <div className="col">
                        <div className="card mb-4 product-wap rounded-0 d-flex">
                            <div className="card rounded-0">
                                <img className="card-img img-fluid custom-image" src={imagenesProductos[0]}/>
                                <div
                                    className="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                    <ul className="list-unstyled">
                                        <li><a className="btn btn-success text-white" href="shop-single.html"><i
                                                    className="far fa-heart"></i></a></li>
                                        <li><a className="btn btn-success text-white mt-2" href="shop-single.html"><i
                                                    className="far fa-eye"></i></a></li>
                                        <li><a className="btn btn-success text-white mt-2" href="shop-single.html"><i
                                                    className="fas fa-cart-plus"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="card-body d-flex flex-column justify-content-between">
                                <a asp-controller="Landing" asp-action="DetalleProducto" className="h3 text-decoration-none">Camiseta Espacio</a>
                                <ul className="w-100 list-unstyled d-flex justify-content-between mb-0">

                                    <li className="pt-2">
                                        <span
                                            className="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                                    </li>
                                </ul>

                                <p className="text-center mb-0">35.000</p>
                            </div>
                        </div>
                    </div>


                    {/* <!-- producto unico --> */}
                    <div className="col-md-4">
                        <div className="card mb-4 product-wap rounded-0">
                            <div className="card rounded-0">
                                <img className="card-img rounded-0 img-fluid" src={imagenesProductos[4]}/>
                                <div
                                    className="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                    <ul className="list-unstyled">
                                        <li><a className="btn btn-success text-white" href="shop-single.html"><i
                                                    className="far fa-heart"></i></a></li>
                                        <li><a className="btn btn-success text-white mt-2" href="shop-single.html"><i
                                                    className="far fa-eye"></i></a></li>
                                        <li><a className="btn btn-success text-white mt-2" href="shop-single.html"><i
                                                    className="fas fa-cart-plus"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="card-body">
                                <a href="shop-single.html" className="h3 text-decoration-none">Camiseta Espacio v2</a>
                                <ul className="w-100 list-unstyled d-flex justify-content-between mb-0">

                                    <li className="pt-2">
                                        <span
                                            className="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                                    </li>
                                </ul>

                                <p className="text-center mb-0">35.000</p>
                            </div>
                        </div>
                    </div>

                    {/* <!-- producto unico --> */}
                    <div className="col-md-4">
                        <div className="card mb-4 product-wap rounded-0">
                            <div className="card rounded-0">
                                <img className="card-img rounded-0 img-fluid" src={imagenesProductos[1]}/>
                                <div
                                    className="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                    <ul className="list-unstyled">
                                        <li><a className="btn btn-success text-white" href="shop-single.html"><i
                                                    className="far fa-heart"></i></a></li>
                                        <li><a className="btn btn-success text-white mt-2" href="shop-single.html"><i
                                                    className="far fa-eye"></i></a></li>
                                        <li><a className="btn btn-success text-white mt-2" href="shop-single.html"><i
                                                    className="fas fa-cart-plus"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="card-body">
                                <a href="shop-single.html" className="h3 text-decoration-none">Camiseta Among Us</a>
                                <ul className="w-100 list-unstyled d-flex justify-content-between mb-0">

                                    <li className="pt-2">
                                        <span
                                            className="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                                    </li>
                                </ul>

                                <p className="text-center mb-0">35.000</p>
                            </div>
                        </div>
                    </div>
                    {/* <!-- producto unico --> */}
                    <div className="col-md-4">
                        <div className="card mb-4 product-wap rounded-0">
                            <div className="card rounded-0">
                                <img className="card-img rounded-0 img-fluid" src={imagenesProductos[2]}/>
                                <div
                                    className="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                    <ul className="list-unstyled">
                                        <li><a className="btn btn-success text-white" href="shop-single.html"><i
                                                    className="far fa-heart"></i></a></li>
                                        <li><a className="btn btn-success text-white mt-2" href="shop-single.html"><i
                                                    className="far fa-eye"></i></a></li>
                                        <li><a className="btn btn-success text-white mt-2" href="shop-single.html"><i
                                                    className="fas fa-cart-plus"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="card-body">
                                <a href="shop-single.html" className="h3 text-decoration-none">Camiseta El Patron</a>
                                <ul className="w-100 list-unstyled d-flex justify-content-between mb-0">

                                    <li className="pt-2">
                                        <span
                                            className="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                                    </li>
                                </ul>

                                <p className="text-center mb-0">35.000</p>
                            </div>
                        </div>
                    </div>
                    {/* <!-- producto unico --> */}
                    <div className="col-md-4">
                        <div className="card mb-4 product-wap rounded-0">
                            <div className="card rounded-0">
                                <img className="card-img rounded-0 img-fluid" src={imagenesProductos[3]}/>
                                <div
                                    className="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                    <ul className="list-unstyled">
                                        <li><a className="btn btn-success text-white" href="shop-single.html"><i
                                                    className="far fa-heart"></i></a></li>
                                        <li><a className="btn btn-success text-white mt-2" href="shop-single.html"><i
                                                    className="far fa-eye"></i></a></li>
                                        <li><a className="btn btn-success text-white mt-2" href="shop-single.html"><i
                                                    className="fas fa-cart-plus"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="card-body">
                                <a href="shop-single.html" className="h3 text-decoration-none">Camiseta Chapo</a>
                                <ul className="w-100 list-unstyled d-flex justify-content-between mb-0">

                                    <li className="pt-2">
                                        <span
                                            className="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                                    </li>
                                </ul>

                                <p className="text-center mb-0">35.000</p>
                            </div>
                        </div>
                    </div>
                    {/* <!-- producto unico --> */}
                    <div className="col-md-4">
                        <div className="card mb-4 product-wap rounded-0">
                            <div className="card rounded-0">
                                <img className="card-img rounded-0 img-fluid" src={imagenesProductos[5]}/>
                                <div
                                    className="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                    <ul className="list-unstyled">
                                        <li><a className="btn btn-success text-white" href="shop-single.html"><i
                                                    className="far fa-heart"></i></a></li>
                                        <li><a className="btn btn-success text-white mt-2" href="shop-single.html"><i
                                                    className="far fa-eye"></i></a></li>
                                        <li><a className="btn btn-success text-white mt-2" href="shop-single.html"><i
                                                    className="fas fa-cart-plus"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="card-body">
                                <a href="shop-single.html" className="h3 text-decoration-none">Camiseta Espacio v3</a>
                                <ul className="w-100 list-unstyled d-flex justify-content-between mb-0">

                                    <li className="pt-2">
                                        <span
                                            className="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                                    </li>
                                </ul>

                                <p className="text-center mb-0">35.000</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* <!-- producto unico --> */}
                    <div className="col-md-4">
                        <div className="card mb-4 product-wap rounded-0">
                            <div className="card rounded-0">
                                <img className="card-img rounded-0 img-fluid" src={imagenesProductos[6]}/>
                                <div
                                    className="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                    <ul className="list-unstyled">
                                        <li><a className="btn btn-success text-white" href="shop-single.html"><i
                                                    className="far fa-heart"></i></a></li>
                                        <li><a className="btn btn-success text-white mt-2" href="shop-single.html"><i
                                                    className="far fa-eye"></i></a></li>
                                        <li><a className="btn btn-success text-white mt-2" href="shop-single.html"><i
                                                    className="fas fa-cart-plus"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="card-body">
                                <a href="shop-single.html" className="h3 text-decoration-none">Camiseta Marvel</a>
                                <ul className="w-100 list-unstyled d-flex justify-content-between mb-0">

                                    <li className="pt-2">
                                        <span
                                            className="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                                    </li>
                                </ul>

                                <p className="text-center mb-0">35.000</p>
                            </div>
                        </div>
                    </div>
                    {/* <!-- producto unico --> */}
                    <div className="col-md-4">
                        <div className="card mb-4 product-wap rounded-0">
                            <div className="card rounded-0">
                                <img className="card-img rounded-0 img-fluid" src={imagenesProductos[7]}/>
                                <div
                                    className="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                    <ul className="list-unstyled">
                                        <li><a className="btn btn-success text-white" href="shop-single.html"><i
                                                    className="far fa-heart"></i></a></li>
                                        <li><a className="btn btn-success text-white mt-2" href="shop-single.html"><i
                                                    className="far fa-eye"></i></a></li>
                                        <li><a className="btn btn-success text-white mt-2" href="shop-single.html"><i
                                                    className="fas fa-cart-plus"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="card-body">
                                <a href="shop-single.html" className="h3 text-decoration-none">Camiseta DeadPool</a>
                                <ul className="w-100 list-unstyled d-flex justify-content-between mb-0">

                                    <li className="pt-2">
                                        <span
                                            className="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                        <span
                                            className="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                                    </li>
                                </ul>

                                <p className="text-center mb-0">35.000</p>
                            </div>
                        </div>
                    </div>
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
}

