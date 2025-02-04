import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface PresupuestoProps {
  obraId: string;
}

interface Actividad {
  _id: string;
  actividad: {
    _id: string;
    nombre: string;
    fechaInicio: string;
    fechaFin: string;
  };
  observacion: string;
  completada: boolean;
}

export function Presupuesto({ obraId }: PresupuestoProps) {
  const [montoTotal, setMontoTotal] = useState<number | null>(null);
  const [devengadoTotal, setDevengadoTotal] = useState<number | null>(0);
  const [porcentajeAvance, setPorcentajeAvance] = useState(0);
  const [ponderacionActiva, setPonderacionActiva] = useState(false);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [categoria, setCategoria] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchObraDetails();
  }, [obraId]);

  useEffect(() => {
    if (categoria) {
      fetchInversion();
    }
  }, [categoria]);

  const fetchObraDetails = async () => {
    try {
      const response = await fetch(`/api/obras/${obraId}`);
      if (response.ok) {
        const data = await response.json();
        setCategoria(data.categoria);
        setDevengadoTotal(data.devengadoTotal || 0);
        setPorcentajeAvance(data.porcentajeAvance || 0);
        setActividades(data.actividades || []);
        setPonderacionActiva(data.ponderacionActiva || false);
      } else {
        throw new Error("Error al obtener los detalles de la obra");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudieron obtener los detalles de la obra.",
        variant: "destructive",
      });
    }
  };

  const fetchInversion = async () => {
    try {
      const response = await fetch(
        `/api/inversiones/${encodeURIComponent(categoria)}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Inversión obtenida:", data);
        setMontoTotal(data.inversion);
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.error || "Error al obtener la inversión");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo obtener la información de inversión.",
        variant: "destructive",
      });
    }
  };

  const handleDevengadoChange = (value: number | null) => {
    setDevengadoTotal(value);
    const newPorcentaje = montoTotal && value ? (value / montoTotal) * 100 : 0;
    setPorcentajeAvance(newPorcentaje);
  };

  const handleConfirmChanges = async () => {
    try {
      const response = await fetch(`/api/obras/${obraId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          devengadoTotal,
          porcentajeAvance,
          ponderacionActiva,
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        toast({
          title: "Actualizado",
          description: "Los cambios han sido guardados exitosamente.",
        });
      } else {
        throw new Error("Error al actualizar el presupuesto");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Presupuesto</CardTitle>
        <CardDescription>
          Control y seguimiento del presupuesto de la obra
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Información Presupuestaria
            </h3>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isEditing ? "Cancelar Edición" : "Editar"}
            </Button>
          </div>
          <div>
            <Label htmlFor="categoria">Categoría</Label>
            <Input id="categoria" value={categoria} disabled />
          </div>
          <div>
            <Label htmlFor="monto-total">Monto Total (USD)</Label>
            <Input
              id="monto-total"
              type="number"
              value={montoTotal !== null ? montoTotal : ""}
              onChange={(e) =>
                setMontoTotal(e.target.value ? Number(e.target.value) : null)
              }
              disabled
            />
          </div>
          <div>
            <Label htmlFor="devengado-total">Devengado Total (USD)</Label>
            <Input
              id="devengado-total"
              type="number"
              value={devengadoTotal !== null ? devengadoTotal : ""}
              onChange={(e) =>
                handleDevengadoChange(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="porcentaje-avance">
              Porcentaje de Avance Presupuestario
            </Label>
            <Input
              id="porcentaje-avance"
              type="number"
              value={porcentajeAvance.toFixed(2)}
              disabled
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="ponderacion"
              checked={ponderacionActiva}
              onCheckedChange={setPonderacionActiva}
              disabled={!isEditing}
            />
            <Label htmlFor="ponderacion">Activar Ponderación</Label>
          </div>
          {ponderacionActiva && (
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-semibold mb-2">Ponderación de Actividades</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Actividad</TableHead>
                    <TableHead>Porcentaje</TableHead>
                    <TableHead>Monto Asignado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actividades.map((actividad, index) => {
                    const porcentaje = 100 / actividades.length;
                    const montoAsignado = montoTotal
                      ? montoTotal * (porcentaje / 100)
                      : 0;
                    return (
                      <TableRow key={actividad._id}>
                        <TableCell>{actividad.actividad.nombre}</TableCell>
                        <TableCell>{porcentaje.toFixed(2)}%</TableCell>
                        <TableCell>${montoAsignado.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
          {isEditing && (
            <Button
              onClick={handleConfirmChanges}
              className="w-full bg-blue-100 hover:bg-blue-200 text-blue-600"
            >
              Confirmar Cambios
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
