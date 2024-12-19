"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ActualizarObraForm } from "./actualizar-obra-form";

interface Obra {
  _id: string;
  nombreObra: string;
  ubicacion: string;
  fecha_inicio: string;
  estadoObra: string;
  capacidadInfraestructura: string;
  categoria: string;
  descripcionObra: string;
  tipoIntervencion: string;
}

interface ObrasTableProps {
  onSelectObra: (obra: Obra) => void;
}

export function ObrasTable({ onSelectObra }: ObrasTableProps) {
  const [obras, setObras] = useState<Obra[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchObras();
  }, []);

  const fetchObras = async () => {
    try {
      const response = await fetch("/api/obras");
      if (!response.ok) {
        throw new Error("Error al cargar las obras");
      }
      const data = await response.json();
      setObras(data);
    } catch (error) {
      console.error("Error fetching obras:", error);
      setError(
        "No se pudieron cargar las obras. Por favor, intente de nuevo más tarde."
      );
    }
  };

  const handleUpdateObra = (obra: Obra) => {
    setSelectedObra(obra);
    setIsUpdating(true);
  };

  const handleObraActualizada = () => {
    setIsUpdating(false);
    setSelectedObra(null);
    fetchObras();
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isUpdating && selectedObra) {
    return (
      <ActualizarObraForm
        obra={selectedObra}
        onObraActualizada={handleObraActualizada}
        onCancel={() => setIsUpdating(false)}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Ubicación</TableHead>
          <TableHead>Fecha de Inicio</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {obras.map((obra) => (
          <TableRow key={obra._id}>
            <TableCell>{obra.nombreObra}</TableCell>
            <TableCell>{obra.ubicacion}</TableCell>
            <TableCell>
              {new Date(obra.fecha_inicio).toLocaleDateString()}
            </TableCell>
            <TableCell>{obra.estadoObra}</TableCell>
            <TableCell>
              <Button onClick={() => onSelectObra(obra)} className="mr-2">
                Ver Detalles
              </Button>
              <Button onClick={() => handleUpdateObra(obra)}>Actualizar</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
