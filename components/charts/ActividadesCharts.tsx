import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ActividadesChartsProps {
  actividades: {
    nombre: string;
    completada: boolean;
  }[];
}

export function ActividadesCharts({ actividades }: ActividadesChartsProps) {
  const completadas = actividades.filter((a) => a.completada).length;
  const pendientes = actividades.length - completadas;

  const barData = {
    labels: ["Completadas", "Pendientes"],
    datasets: [
      {
        label: "Número de Actividades",
        data: [completadas, pendientes],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  const pieData = {
    labels: ["Completadas", "Pendientes"],
    datasets: [
      {
        data: [completadas, pendientes],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Estado de Actividades</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={barData} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Actividades</CardTitle>
        </CardHeader>
        <CardContent>
          <Pie data={pieData} />
        </CardContent>
      </Card>
    </div>
  );
}
