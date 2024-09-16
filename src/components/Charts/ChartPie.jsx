import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          const value = tooltipItem.raw;
          return `${tooltipItem.label}: ${value} unidades`;
        },
      },
    },
  },
};

export const ChartPie = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Productos más vendidos",
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener pedidos
        const pedidosResponse = await axios.get(
          "https://softshirt-1c3fad7d72e8.herokuapp.com/api/pedidos"
        );
        const pedidos = pedidosResponse.data;

        // Filtrar pedidos con IdEstadoPedido igual a 3
        const pedidosFiltrados = pedidos.filter(
          (pedido) => pedido.IdEstadoPedido === 3
        );

        // Contar la cantidad total vendida por producto
        const productosCount = {};

        pedidosFiltrados.forEach((pedido) => {
          pedido.DetallesPedidosProductos.forEach((detalle) => {
            const productoId = detalle.Producto.IdProducto;
            if (!productosCount[productoId]) {
              productosCount[productoId] = {
                cantidad: 0,
                idDisenio: detalle.Producto.IdDisenio, // Asegúrate de que este campo exista
              };
            }
            productosCount[productoId].cantidad += detalle.Cantidad;
          });
        });

        // Convertir el objeto a un array y ordenar por cantidad vendida
        const sortedProductos = Object.keys(productosCount)
          .map((id) => ({
            id,
            ...productosCount[id],
          }))
          .sort((a, b) => b.cantidad - a.cantidad)
          .slice(0, 3);

        // Obtener nombres de diseños
        const designIds = Array.from(
          new Set(sortedProductos.map((producto) => producto.idDisenio))
        ); // Obtener IDs únicos de diseños
        const designsResponse = await axios.get(
          "https://softshirt-1c3fad7d72e8.herokuapp.com/api/disenios"
        );
        const diseños = designsResponse.data;

        console.log("Diseños:", diseños);

        // Mapear IDs de diseños a nombres
        const designMap = diseños.reduce((map, design) => {
          map[design.IdDisenio] = design.NombreDisenio;
          return map;
        }, {});

        // Preparar datos para el gráfico
        const labels = sortedProductos.map(
          (producto) => designMap[producto.idDisenio] || "Desconocido"
        );
        const data = sortedProductos.map((producto) => producto.cantidad);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Productos más vendidos",
              data: data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(54, 162, 235, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(54, 162, 235, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  return <Pie data={chartData} options={options} />;
};
