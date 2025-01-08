import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface Obra {
  _id: string;
  nombreObra: string;
  estadoObra: string;
  fecha_inicio: string;
  // Add other relevant fields
}

export function InformacionGeneral() {
  const [obras, setObras] = useState<Obra[]>([]);

  useEffect(() => {
    fetchObras();
  }, []);

  const fetchObras = async () => {
    try {
      const response = await fetch("/api/obras");
      if (response.ok) {
        const data = await response.json();
        setObras(data);
      } else {
        console.error("Failed to fetch obras");
      }
    } catch (error) {
      console.error("Error fetching obras:", error);
    }
  };

  const estadosData = {
    labels: ["Planificación", "En Ejecución", "Completada", "Suspendida"],
    datasets: [
      {
        data: [
          obras.filter((o) => o.estadoObra === "Planificación").length,
          obras.filter((o) => o.estadoObra === "En Ejecución").length,
          obras.filter((o) => o.estadoObra === "Completada").length,
          obras.filter((o) => o.estadoObra === "Suspendida").length,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const obrasIniciadasPorMes = obras.reduce((acc, obra) => {
    const fecha = new Date(obra.fecha_inicio);
    const mes = fecha.toLocaleString("default", { month: "long" });
    acc[mes] = (acc[mes] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const obrasIniciadasData = {
    labels: Object.keys(obrasIniciadasPorMes),
    datasets: [
      {
        label: "Obras Iniciadas por Mes",
        data: Object.values(obrasIniciadasPorMes),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Estado de Obras</CardTitle>
        </CardHeader>
        <CardContent>
          <Pie data={estadosData} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Obras Iniciadas por Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={obrasIniciadasData} />
        </CardContent>
      </Card>
      {/* Add more charts as needed */}
    </div>
  );
}
