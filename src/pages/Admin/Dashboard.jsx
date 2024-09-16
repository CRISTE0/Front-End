import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChartLine } from "../../components/Charts/ChartLine";
import { ChartPie } from "../../components/Charts/ChartPie";
import dayjs from "dayjs"; // Importa dayjs para manejar fechas
import { AdminFooter } from "../../components/Admin/AdminFooter";
import Loader from "../../components/Loader/loader";

export const Dashboard = () => {
  const [pedidosPendientes, setPedidosPendientes] = useState(0);
  const [totalCompras, setTotalCompras] = useState(0);
  const [gananciaDiaria, setGananciaDiaria] = useState(0);
  const [gananciaMensual, setGananciaMensual] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get("https://softshirt-1c3fad7d72e8.herokuapp.com/api/pedidos");
        const pedidos = response.data;
        const pedidosFiltrados = pedidos.filter(
          (pedido) => pedido.IdEstadoPedido == 1
        );
        setPedidosPendientes(pedidosFiltrados.length);
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchCompras = async () => {
      try {
        const response = await axios.get("https://softshirt-1c3fad7d72e8.herokuapp.com/api/compras");
        const compras = response.data;
        const total = compras.reduce((acc, compra) => acc + compra.Total, 0);
        setTotalCompras(total);
      } catch (error) {
        console.error("Error al obtener las compras:", error);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchGananciaDiaria = async () => {
      try {
        const response = await axios.get("https://softshirt-1c3fad7d72e8.herokuapp.com/api/pedidos");
        const pedidos = response.data;
        const fechaActual = dayjs().format("YYYY-MM-DD");
        const pedidosDelDia = pedidos.filter(
          (pedido) =>
            pedido.IdEstadoPedido == 3 && pedido.Fecha.startsWith(fechaActual)
        );
        const ganancia = pedidosDelDia.reduce(
          (acc, pedido) => acc + pedido.Total,
          0
        );
        setGananciaDiaria(ganancia);
      } catch (error) {
        console.error("Error al obtener las ganancias diarias:", error);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchGananciaMensual = async () => {
      try {
        const response = await axios.get("https://softshirt-1c3fad7d72e8.herokuapp.com/api/pedidos");
        const pedidos = response.data;
        const mesActual = dayjs().month() + 1;
        const anioActual = dayjs().year();
        const pedidosDelMes = pedidos.filter((pedido) => {
          const fechaPedido = dayjs(pedido.Fecha);
          const mesPedido = fechaPedido.month() + 1;
          const anioPedido = fechaPedido.year();
          return (
            pedido.IdEstadoPedido == 3 &&
            mesPedido == mesActual &&
            anioPedido == anioActual
          );
        });
        const totalGananciaMensual = pedidosDelMes.reduce(
          (sum, pedido) => sum + pedido.Total,
          0
        );
        setGananciaMensual(totalGananciaMensual);
      } catch (error) {
        console.error("Error al obtener las ganancias mensuales:", error);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchAllData = async () => {
      await fetchPedidos();
      await fetchCompras();
      await fetchGananciaDiaria();
      await fetchGananciaMensual();
    };
  
    fetchAllData();
  }, []);
  

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {/* <!-- Begin Page Content --> */}
      <div className="container-fluid">
        {/* <!-- Page Heading --> */}
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          {/* <h1 className="h3 mb-0 text-gray-800">Dashboard</h1> */}
        </div>

        {/* <!-- Content Row --> */}
        <div className="row">
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Ganancia Mensual
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      ${gananciaMensual.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-chart-line fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Earnings (Daily) Card Example --> */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-success shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                      Ganancia Diaria
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      ${gananciaDiaria.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Capital Invertido / Mes --> */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-info shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                      Capital Invertido / Mes
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      ${totalCompras.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-coins fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Pending Requests Card Example --> */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-warning shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                      Pedidos Pendientes
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {pedidosPendientes}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fa fa-clock fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Content Row --> */}
        <div className="row">
          {/* <!-- Area Chart --> */}
          <div className="col-xl-8 col-lg-5">
            <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">
                  Resumen de ganancias
                </h6>
              </div>
              <div
                className="card-body"
                style={{
                  padding: "0.5rem",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div className="chart-area" style={{ width: "80%" }}>
                  <ChartLine />
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Pie Chart --> */}
          <div className="col-xl-4 col-lg-5">
            <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">
                  Productos más vendidos
                </h6>
              </div>
              <div
                className="card-body"
                style={{
                  paddingTop: "39px",
                }}
              >
                <div className="chart-pie pt-4 pb-2">
                  <ChartPie />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AdminFooter/>
    </>
  );
};
