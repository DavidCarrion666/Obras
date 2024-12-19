"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CrearObraFormProps {
  onObraCreated: () => void;
  onCancel: () => void;
}

export function CrearObraForm({ onObraCreated, onCancel }: CrearObraFormProps) {
  const [formData, setFormData] = useState({
    nombreObra: "",
    capacidadInfraestructura: "",
    categoria: "",
    descripcionObra: "",
    estadoObra: "",
    tipoIntervencion: "",
    ubicacion: "",
    fecha_inicio: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("/api/obras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const newObra = await response.json();
        onObraCreated();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear la obra");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error desconocido al crear la obra"
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Nueva Obra</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombreObra">Nombre de la Obra</Label>
            <Input
              id="nombreObra"
              name="nombreObra"
              value={formData.nombreObra}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacidadInfraestructura">
              Capacidad de Infraestructura
            </Label>
            <Input
              id="capacidadInfraestructura"
              name="capacidadInfraestructura"
              value={formData.capacidadInfraestructura}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoría</Label>
            <Input
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcionObra">Descripción de la Obra</Label>
            <Textarea
              id="descripcionObra"
              name="descripcionObra"
              value={formData.descripcionObra}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estadoObra">Estado de la Obra</Label>
            <Select
              name="estadoObra"
              value={formData.estadoObra}
              onValueChange={(value) =>
                handleChange({ target: { name: "estadoObra", value } } as any)
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planificación">Planificación</SelectItem>
                <SelectItem value="En Ejecución">En Ejecución</SelectItem>
                <SelectItem value="Completada">Completada</SelectItem>
                <SelectItem value="Suspendida">Suspendida</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipoIntervencion">Tipo de Intervención</Label>
            <Input
              id="tipoIntervencion"
              name="tipoIntervencion"
              value={formData.tipoIntervencion}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ubicacion">Ubicación</Label>
            <Input
              id="ubicacion"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
            <Input
              id="fecha_inicio"
              name="fecha_inicio"
              type="date"
              value={formData.fecha_inicio}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Crear Obra</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
