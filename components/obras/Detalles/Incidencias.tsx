"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isValid } from "date-fns";
import { Loader2, Edit } from "lucide-react";

interface Solucion {
  descripcion: string;
  fechaImplementacion: string;
  responsable: string;
  documentos: string[];
}

interface Problema {
  _id: string;
  descripcion: string;
  evidencias: string[];
  reportesSecundarios: string[];
  solucion?: Solucion;
  estado: "Pendiente" | "En Proceso" | "Resuelto";
}

interface Inspeccion {
  _id: string;
  fecha: string;
  actividadId: {
    _id: string;
    nombre: string;
  };
  observaciones: string;
  problemas: Problema[];
  estado: "Pendiente" | "En Proceso" | "Completada";
}

interface IncidenciasProps {
  obraId: string;
}

export function Incidencias({ obraId }: IncidenciasProps) {
  const [inspecciones, setInspecciones] = useState<Inspeccion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInspeccion, setSelectedInspeccion] =
    useState<Inspeccion | null>(null);
  const [selectedProblema, setSelectedProblema] = useState<Problema | null>(
    null
  );
  const [isEditingInspeccion, setIsEditingInspeccion] = useState(false);
  const [isEditingProblema, setIsEditingProblema] = useState(false);
  const [editedInspeccionState, setEditedInspeccionState] = useState("");
  const [editedProblemaState, setEditedProblemaState] = useState("");
  const [solucion, setSolucion] = useState({
    descripcion: "",
    responsable: "",
    documentos: [] as File[],
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchInspecciones();
  }, []);

  const fetchInspecciones = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/obras/${obraId}/inspecciones`);
      if (!response.ok) {
        throw new Error("Error al obtener las inspecciones");
      }
      const data = await response.json();
      setInspecciones(data);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las inspecciones.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditInspeccion = (inspeccion: Inspeccion) => {
    setSelectedInspeccion(inspeccion);
    setEditedInspeccionState(inspeccion.estado);
    setIsEditingInspeccion(true);
  };

  const handleEditProblema = (problema: Problema) => {
    setSelectedProblema(problema);
    setEditedProblemaState(problema.estado);
    setSolucion({
      descripcion: problema.solucion?.descripcion || "",
      responsable: problema.solucion?.responsable || "",
      documentos: [],
    });
    setIsEditingProblema(true);
  };

  const handleUpdateInspeccion = async () => {
    if (!selectedInspeccion) return;

    try {
      const response = await fetch(
        `/api/obras/${obraId}/inspecciones/${selectedInspeccion._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado: editedInspeccionState,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar la inspección");
      }

      const updatedInspeccion = await response.json();

      setInspecciones(
        inspecciones.map((i) =>
          i._id === updatedInspeccion._id ? updatedInspeccion : i
        )
      );
      setSelectedInspeccion(updatedInspeccion);
      setIsEditingInspeccion(false);
      toast({
        title: "Éxito",
        description: "Inspección actualizada correctamente.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la inspección.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProblema = async () => {
    if (!selectedInspeccion || !selectedProblema) return;

    try {
      const formData = new FormData();
      formData.append("estado", editedProblemaState);
      formData.append("descripcion", selectedProblema.descripcion);
      formData.append("solucion[descripcion]", solucion.descripcion);
      formData.append("solucion[responsable]", solucion.responsable);
      formData.append(
        "solucion[fechaImplementacion]",
        new Date().toISOString()
      );
      solucion.documentos.forEach((file, index) => {
        formData.append(`solucion[documentos]`, file);
      });

      const response = await fetch(
        `/api/obras/${obraId}/inspecciones/${selectedInspeccion._id}/problemas/${selectedProblema._id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el problema");
      }

      const updatedProblema = await response.json();

      setInspecciones(
        inspecciones.map((i) => {
          if (i._id === selectedInspeccion._id) {
            return {
              ...i,
              problemas: i.problemas.map((p) =>
                p._id === updatedProblema._id ? updatedProblema : p
              ),
            };
          }
          return i;
        })
      );
      setSelectedInspeccion((prevInspeccion) => {
        if (prevInspeccion) {
          return {
            ...prevInspeccion,
            problemas: prevInspeccion.problemas.map((p) =>
              p._id === updatedProblema._id ? updatedProblema : p
            ),
          };
        }
        return null;
      });
      setIsEditingProblema(false);
      toast({
        title: "Éxito",
        description: "Problema actualizado correctamente.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar el problema.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Fecha no disponible";
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "dd/MM/yyyy") : "Fecha inválida";
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "En Proceso":
        return "bg-blue-100 text-blue-800";
      case "Completada":
      case "Resuelto":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Lista de Inspecciones</CardTitle>
          <CardDescription>
            Seleccione una inspección para ver sus detalles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Actividad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inspecciones.map((inspeccion) => (
                  <TableRow
                    key={inspeccion._id}
                    className={`cursor-pointer hover:bg-gray-100 ${
                      selectedInspeccion?._id === inspeccion._id
                        ? "bg-blue-50"
                        : ""
                    }`}
                    onClick={() => setSelectedInspeccion(inspeccion)}
                  >
                    <TableCell>{formatDate(inspeccion.fecha)}</TableCell>
                    <TableCell>{inspeccion.actividadId.nombre}</TableCell>
                    <TableCell>
                      <Badge className={getEstadoBadgeColor(inspeccion.estado)}>
                        {inspeccion.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditInspeccion(inspeccion);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Detalles de la Inspección</CardTitle>
          <CardDescription>
            {selectedInspeccion
              ? `Inspección del ${formatDate(selectedInspeccion.fecha)}`
              : "Seleccione una inspección para ver sus detalles"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedInspeccion ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Actividad</h4>
                <p>{selectedInspeccion.actividadId.nombre}</p>
              </div>
              <div>
                <h4 className="font-semibold">Observaciones</h4>
                <p>{selectedInspeccion.observaciones}</p>
              </div>
              <div>
                <h4 className="font-semibold">Problemas</h4>
                {selectedInspeccion.problemas.map((problema) => (
                  <Card key={problema._id} className="mt-2">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <Badge className={getEstadoBadgeColor(problema.estado)}>
                          {problema.estado}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProblema(problema)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="font-semibold">Descripción:</p>
                      <p>{problema.descripcion}</p>
                      {problema.solucion && (
                        <div className="mt-2">
                          <p className="font-semibold">Solución:</p>
                          <p>{problema.solucion.descripcion}</p>
                          <p>
                            <span className="font-semibold">Responsable:</span>{" "}
                            {problema.solucion.responsable}
                          </p>
                          <p>
                            <span className="font-semibold">
                              Fecha de implementación:
                            </span>{" "}
                            {formatDate(problema.solucion.fechaImplementacion)}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No hay inspección seleccionada
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditingInspeccion} onOpenChange={setIsEditingInspeccion}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Inspección</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="estado">Estado de la Inspección</Label>
              <Select
                value={editedInspeccionState}
                onValueChange={setEditedInspeccionState}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En Proceso">En Proceso</SelectItem>
                  <SelectItem value="Completada">Completada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditingInspeccion(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateInspeccion}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditingProblema} onOpenChange={setIsEditingProblema}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Solucionar Problema</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="problema-descripcion">
                Descripción del Problema
              </Label>
              <Textarea
                id="problema-descripcion"
                value={selectedProblema?.descripcion || ""}
                readOnly
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado-problema">Estado del Problema</Label>
              <Select
                value={editedProblemaState}
                onValueChange={setEditedProblemaState}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En Proceso">En Proceso</SelectItem>
                  <SelectItem value="Resuelto">Resuelto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="solucion-descripcion">
                Descripción de la Solución
              </Label>
              <Textarea
                id="solucion-descripcion"
                value={solucion.descripcion}
                onChange={(e) =>
                  setSolucion({ ...solucion, descripcion: e.target.value })
                }
                placeholder="Detalle la solución implementada"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="solucion-responsable">Responsable</Label>
                <Input
                  id="solucion-responsable"
                  value={solucion.responsable}
                  onChange={(e) =>
                    setSolucion({ ...solucion, responsable: e.target.value })
                  }
                  placeholder="Nombre del responsable"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="solucion-fecha">Fecha de Implementación</Label>
                <Input
                  id="solucion-fecha"
                  type="date"
                  value={format(new Date(), "yyyy-MM-dd")}
                  onChange={(e) =>
                    setSolucion({
                      ...solucion,
                      fechaImplementacion: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="solucion-documentos">Documentos de Soporte</Label>
              <Input
                id="solucion-documentos"
                type="file"
                multiple
                onChange={(e) =>
                  setSolucion({
                    ...solucion,
                    documentos: Array.from(e.target.files || []),
                  })
                }
              />
              {solucion.documentos.length > 0 && (
                <p className="text-sm text-gray-500">
                  {solucion.documentos.length} archivo(s) seleccionado(s)
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditingProblema(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateProblema}>Guardar Solución</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
