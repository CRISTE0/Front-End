import React from "react";

import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

var beneficios = [0, 56, 20, 36, 80, 40, 30, -20, 25, 30, 12, 60];
var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

var midata = {
    labels: meses,
    datasets: [ // Cada una de las líneas del gráfico
        {
            label: 'Beneficios',
            data: beneficios,
            tension: 0.5,
            fill : true,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            pointRadius: 5,
            pointBorderColor: 'rgba(255, 99, 132)',
            pointBackgroundColor: 'rgba(255, 99, 132)',
        },
        {
            label: 'Otra línea',
            data: [20, 25, 60, 65, 45, 10, 0, 25, 35, 7, 20, 25]
        },
    ],
};

var misoptions = {
    scales : {
        y : {
            min : 0
        },
        x: {
            ticks: { color: 'rgb(255, 99, 132)'}
        }
    }
};
 
export const ChartLine = () => {
    
  return (

    

    <Line data={midata} options={misoptions}/>

          // <Line
          //   data= {{
          //     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          //     datasets: [{
          //       label: "Earnings",
          //       lineTension: 0.3,
          //       backgroundColor: "rgba(78, 115, 223, 0.05)",
          //       borderColor: "rgba(78, 115, 223, 1)",
          //       pointRadius: 3,
          //       pointBackgroundColor: "rgba(78, 115, 223, 1)",
          //       pointBorderColor: "rgba(78, 115, 223, 1)",
          //       pointHoverRadius: 3,
          //       pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
          //       pointHoverBorderColor: "rgba(78, 115, 223, 1)",
          //       pointHitRadius: 10,
          //       pointBorderWidth: 2,
          //       data: [0, 10000, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000, 25000, 40000],
          //     }],
          //   }}
          // />




  );
};

