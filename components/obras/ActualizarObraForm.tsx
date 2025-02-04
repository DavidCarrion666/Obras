"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Obra {
  _id: string;
  nombreObra: string;
  capacidadInfraestructura: string;
  categoria: string;
  descripcionObra: string;
  estadoObra: string;
  tipoIntervencion: string;
  cup: string;
  ubicaciones: Array<{
    nombre: string;
    latitud: number;
    longitud: number;
  }>;
  fecha_inicio: string;
  fecha_fin?: string;
  presupuesto: number;
  actividades: Array<{
    actividad: string;
    observacion: string;
    completada: boolean;
  }>;
  devengadoTotal?: number;
  porcentajeAvance?: number;
}

interface ActualizarObraFormProps {
  obra: Obra;
  onObraActualizada: () => void;
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

export function ActualizarObraForm({
  obra,
  onObraActualizada,
  onCancel,
}: ActualizarObraFormProps) {
  const [formData, setFormData] = useState({
    ...obra,
    fecha_inicio: obra.fecha_inicio || "",
    fecha_fin: obra.fecha_fin || "",
    motivoActualizacion: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(`/api/obras/${obra._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const updatedObra = await response.json();
        onObraActualizada();
        toast({
          title: "Obra Actualizada",
          description: "La obra ha sido actualizada exitosamente.",
          variant: "success",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar la obra");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error desconocido al actualizar la obra"
      );
      toast({
        title: "Error",
        description: "No se pudo actualizar la obra.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "date") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? new Date(value).toISOString() : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-800">Actualizar Obra</CardTitle>
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
              value={
                formData.fecha_inicio ? formData.fecha_inicio.split("T")[0] : ""
              }
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
              value={formData.fecha_fin ? formData.fecha_fin.split("T")[0] : ""}
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
          <div className="space-y-2">
            <Label htmlFor="motivoActualizacion">
              Motivo de la Actualización
            </Label>
            <Textarea
              id="motivoActualizacion"
              name="motivoActualizacion"
              value={formData.motivoActualizacion}
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
            Actualizar Obra
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
