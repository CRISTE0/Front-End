import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarController,  // Registrar BarController
  LineController, // Registrar LineController
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Importar el plugin
import axios from "axios";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, // Registrar el elemento de barra
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels, // Registrar el plugin
  BarController,  // Añadir BarController
  LineController  // Añadir LineController
);

// Datos y configuración del gráfico
const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const misoptions = {
  scales: {
    y: {
      min: 0,
      title: {
        display: true,
        text: "Cantidad / Total",
      },
    },
    x: {
      title: {
        display: true,
        text: "Meses",
      },
      ticks: {
        color: "rgb(255, 99, 132)",
      },
    },
  },
  plugins: {
    datalabels: {
      display: false, // Desactivar etiquetas de datos globalmente para el gráfico
    },
  },
};

export const ChartLine = () => {
  const [data, setData] = useState({
    meses: meses,
    ventasTotales: Array(12).fill(0),
    comprasTotales: Array(12).fill(0),
    cantidadVentas: Array(12).fill(0),
    cantidadCompras: Array(12).fill(0),
  });

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const [ventasResponse, comprasResponse] = await Promise.all([
          axios.get("https://softshirt-1c3fad7d72e8.herokuapp.com/api/pedidos"),
          axios.get("https://softshirt-1c3fad7d72e8.herokuapp.com/api/compras"),
        ]);

        const ventas = ventasResponse.data;
        const compras = comprasResponse.data;

        // Procesar ventas
        const ventasFiltradas = ventas.filter(
          (venta) => venta.IdEstadoPedido === 3
        );
        const ventasTotalesPorMes = Array(12).fill(0);
        const cantidadVentasPorMes = Array(12).fill(0);

        ventasFiltradas.forEach((venta) => {
          const mesIndex = moment(venta.Fecha).month();
          ventasTotalesPorMes[mesIndex] += venta.Total;
          cantidadVentasPorMes[mesIndex] += 1;
        });

        // Procesar compras
        const comprasTotalesPorMes = Array(12).fill(0);
        const cantidadComprasPorMes = Array(12).fill(0);

        compras.forEach((compra) => {
          const mesIndex = moment(compra.Fecha).month();
          comprasTotalesPorMes[mesIndex] += compra.Total;
          cantidadComprasPorMes[mesIndex] += 1; // Contar las compras por mes
        });

        // Actualizar el estado con los datos procesados
        setData({
          meses: meses,
          ventasTotales: ventasTotalesPorMes,
          comprasTotales: comprasTotalesPorMes,
          cantidadVentas: cantidadVentasPorMes,
          cantidadCompras: cantidadComprasPorMes,
        });
      } catch (error) {
        console.error("Error obteniendo los datos:", error);
      }
    };

    obtenerDatos();
  }, []);

  const midata = {
    labels: data.meses,
    datasets: [
      {
        label: "Ventas",
        data: data.ventasTotales,
        tension: 0.5,
        fill: true,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        pointRadius: 5,
        pointBorderColor: "rgba(255, 99, 132)",
        pointBackgroundColor: "rgba(255, 99, 132)",
        datalabels: {
          display: false,
        },
      },
      {
        label: "Compras",
        data: data.comprasTotales,
        tension: 0.5,
        fill: true,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        pointRadius: 5,
        pointBorderColor: "rgba(54, 162, 235)",
        pointBackgroundColor: "rgba(54, 162, 235)",
        datalabels: {
          display: false,
        },
        hidden: true, // Ocultar el dataset de Compras
      },
      {
        label: "Cantidad de Ventas",
        data: data.cantidadVentas,
        type: "bar",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192)",
        borderWidth: 1,
        datalabels: {
          display: false,
          color: "black",
          formatter: (value) => value.toFixed(0),
          align: "bottom",
        },
        hidden: true, // Ocultar el dataset de Cantidad de Ventas
      },
      {
        label: "Cantidad de Compras",
        data: data.cantidadCompras,
        type: "bar",
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        borderColor: "rgba(255, 159, 64)",
        borderWidth: 1,
        datalabels: {
          display: false,
          color: "black",
          formatter: (value) => value.toFixed(0),
          align: "bottom",
        },
        hidden: true, // Ocultar el dataset de Cantidad de Compras
      },
    ],
  };

  return <Line data={midata} options={misoptions} />;
};
