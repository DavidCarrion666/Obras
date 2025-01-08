import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Edit, Check, Plus } from "lucide-react";
import { ActividadesCharts } from "@/components/charts/ActividadesCharts";

interface Actividad {
  _id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
}

interface ActividadAsignada {
  _id: string;
  actividad: Actividad;
  observacion: string;
  completada: boolean;
}

interface RecursosProps {
  obraId: string;
}

export function Recursos({ obraId }: RecursosProps) {
  const [actividades, setActividades] = useState<ActividadAsignada[]>([]);
  const [actividadesDisponibles, setActividadesDisponibles] = useState<
    Actividad[]
  >([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(
    null
  );
  const [selectedActividadId, setSelectedActividadId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (obraId) {
      fetchActividades();
      fetchActividadesDisponibles();
    }
  }, [obraId]);

  const fetchActividades = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/obras/${obraId}/actividades`);
      if (!response.ok) {
        throw new Error("Error al obtener las actividades asignadas");
      }
      const data = await response.json();
      setActividades(data);
    } catch (error) {
      console.error("Error:", error);
      setError(
        "No se pudieron cargar las actividades. Por favor, intente de nuevo más tarde."
      );
      toast({
        title: "Error",
        description: "No se pudieron cargar las actividades asignadas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActividadesDisponibles = async () => {
    try {
      const response = await fetch("/api/actividades");
      if (!response.ok) {
        throw new Error("Error al obtener las actividades disponibles");
      }
      const data = await response.json();
      setActividadesDisponibles(data);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las actividades disponibles.",
        variant: "destructive",
      });
    }
  };

  const handleObservacionChange = (id: string, observacion: string) => {
    setActividades(
      actividades.map((act) => (act._id === id ? { ...act, observacion } : act))
    );
  };

  const handleCompletadaChange = (id: string, completada: boolean) => {
    setActividades(
      actividades.map((act) => (act._id === id ? { ...act, completada } : act))
    );
  };

  const handleAddActividad = async () => {
    if (!selectedActividadId) {
      toast({
        title: "Error",
        description: "Por favor, seleccione una actividad para añadir.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/obras/${obraId}/actividades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ actividadId: selectedActividadId }),
      });
      if (!response.ok) {
        throw new Error("Error al añadir la actividad");
      }
      await fetchActividades();
      setIsDialogOpen(false);
      setSelectedActividadId("");
      toast({
        title: "Éxito",
        description: "Actividad añadida correctamente.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo añadir la actividad.",
        variant: "destructive",
      });
    }
  };

  const handleEditActivity = (id: string) => {
    setEditingActivityId(id);
  };

  const handleConfirmEdit = async (id: string) => {
    try {
      const actividadToUpdate = actividades.find((act) => act._id === id);
      if (!actividadToUpdate) return;

      const response = await fetch(`/api/obras/${obraId}/actividades/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          observacion: actividadToUpdate.observacion,
          completada: actividadToUpdate.completada,
        }),
      });
      if (!response.ok) {
        throw new Error("Error al actualizar la actividad");
      }
      setEditingActivityId(null);
      await fetchActividades();
      toast({
        title: "Éxito",
        description: "Actividad actualizada correctamente.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la actividad.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Cargando actividades...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cronograma de Actividades</CardTitle>
        <CardDescription>
          Seguimiento de actividades y recursos asignados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Añadir Actividad
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Nueva Actividad</DialogTitle>
                <DialogDescription>
                  Seleccione una actividad para añadir a esta obra.
                </DialogDescription>
              </DialogHeader>
              <Select
                onValueChange={setSelectedActividadId}
                value={selectedActividadId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar actividad" />
                </SelectTrigger>
                <SelectContent>
                  {actividadesDisponibles.map((actividad) => (
                    <SelectItem key={actividad._id} value={actividad._id}>
                      {actividad.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddActividad}>Añadir Actividad</Button>
            </DialogContent>
          </Dialog>
        </div>
        <ActividadesCharts
          actividades={actividades.map((a) => ({
            nombre: a.actividad.nombre,
            completada: a.completada,
          }))}
        />
        <div className="mt-8">
          {actividades.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Actividad</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Fecha Inicio</TableHead>
                  <TableHead>Fecha Fin</TableHead>
                  <TableHead>Observación</TableHead>
                  <TableHead>Completada</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actividades.map((actividad) => (
                  <TableRow key={actividad._id}>
                    <TableCell>{actividad.actividad.nombre}</TableCell>
                    <TableCell>{actividad.actividad.descripcion}</TableCell>
                    <TableCell>
                      {new Date(
                        actividad.actividad.fechaInicio
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(
                        actividad.actividad.fechaFin
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Input
                        value={actividad.observacion || ""}
                        onChange={(e) =>
                          handleObservacionChange(actividad._id, e.target.value)
                        }
                        disabled={editingActivityId !== actividad._id}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={actividad.completada}
                        onCheckedChange={(checked) =>
                          handleCompletadaChange(
                            actividad._id,
                            checked as boolean
                          )
                        }
                        disabled={editingActivityId !== actividad._id}
                      />
                    </TableCell>
                    <TableCell>
                      {editingActivityId === actividad._id ? (
                        <Button
                          onClick={() => handleConfirmEdit(actividad._id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleEditActivity(actividad._id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg mb-4">
                No hay actividades asignadas a esta obra.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Añadir Actividad
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
