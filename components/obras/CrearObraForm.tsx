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
import { useToast } from "@/hooks/use-toast";

interface CrearObraFormProps {
  onObraCreated: () => void;
  onCancel: () => void;
}

const tiposIntervencion = [
  "Construcción",
  "Adecentamiento",
  "Repotenciación",
  "Reconstrucción",
  "Rehabilitación",
  "Reapertura",
];

const categorias = [
  "Agua y Saneamiento",
  "Centros de Desarrollo Infantil",
  "Centros de Salud",
  "Estratégicos",
  "Generación eléctrica",
  "Hospitales",
  "Infraestructura Cultural",
  "Infraestructura Deportiva",
  "Infraestructura Productiva",
  "Infraestructura Turística",
  "Infraestructura Urbana",
  "Institutos Multipropósito",
  "Otros",
  "Parques",
  "Puestos de Salud",
  "Reasentamientos",
  "Seguridad",
  "Unidades Educativas",
  "Universidades",
  "Vialidad",
  "Vivienda",
];

export function CrearObraForm({ onObraCreated, onCancel }: CrearObraFormProps) {
  const [formData, setFormData] = useState({
    nombreObra: "",
    capacidadInfraestructura: "",
    categoria: "",
    descripcionObra: "",
    estadoObra: "",
    tipoIntervencion: "",
    cup: "",
    ubicaciones: [],
    fecha_inicio: "",
    fecha_fin: "",
    presupuesto: 0,
    actividades: [],
  });
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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
        toast({
          title: "Obra Creada",
          description: "La obra ha sido creada exitosamente.",
          variant: "success",
        });
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
      toast({
        title: "Error",
        description: "Hubo un problema al crear la obra.",
        variant: "destructive",
      });
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
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-800">Crear Nueva Obra</CardTitle>
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
            <Select
              name="categoria"
              value={formData.categoria}
              onValueChange={(value) =>
                handleChange({ target: { name: "categoria", value } } as any)
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Select
              name="tipoIntervencion"
              value={formData.tipoIntervencion}
              onValueChange={(value) =>
                handleChange({
                  target: { name: "tipoIntervencion", value },
                } as any)
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un tipo de intervención" />
              </SelectTrigger>
              <SelectContent>
                {tiposIntervencion.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cup">CUP (Código Único de Proyecto)</Label>
            <Input
              id="cup"
              name="cup"
              value={formData.cup}
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
          <div className="space-y-2">
            <Label htmlFor="fecha_fin">Fecha de Fin (opcional)</Label>
            <Input
              id="fecha_fin"
              name="fecha_fin"
              type="date"
              value={formData.fecha_fin}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="presupuesto">Presupuesto</Label>
            <Input
              id="presupuesto"
              name="presupuesto"
              type="number"
              value={formData.presupuesto}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-blue-100 hover:bg-blue-200 text-blue-600"
          >
            Crear Obra
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
