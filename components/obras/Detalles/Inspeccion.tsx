"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import {
  Loader2,
  Plus,
  X,
  ClipboardCheck,
  AlertCircle,
  FileText,
  Upload,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { Progress } from "@/components/ui/porgress";

interface Actividad {
  _id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
}

interface ActividadObra {
  _id: string;
  actividad: Actividad;
  observacion: string;
  completada: boolean;
}

interface Problema {
  descripcion: string;
  evidencias: File[];
  reportesSecundarios: File[];
}

interface Inspeccion {
  _id: string;
  actividadId: Actividad | null;
  fecha: string;
  observaciones: string;
  problemas: Problema[];
  estado: "Pendiente" | "En Proceso" | "Completada";
}

interface InspeccionProps {
  obraId: string;
}

export function Inspeccion({ obraId }: InspeccionProps) {
  const [actividades, setActividades] = useState<ActividadObra[]>([]);
  const [inspecciones, setInspecciones] = useState<Inspeccion[]>([]);
  const [selectedActividad, setSelectedActividad] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchActividadesObra();
    fetchInspecciones();
  }, [obraId]);

  const fetchActividadesObra = async () => {
    try {
      const response = await fetch(`/api/obras/${obraId}/actividades`);
      if (!response.ok) {
        throw new Error("Error al obtener las actividades de la obra");
      }
      const data = await response.json();
      setActividades(data);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las actividades de la obra.",
        variant: "destructive",
      });
    }
  };

  const fetchInspecciones = async () => {
    try {
      const response = await fetch(`/api/obras/${obraId}/inspecciones`);
      if (!response.ok) {
        throw new Error("Error al obtener las inspecciones");
      }
      const data = await response.json();
      console.log("Inspecciones fetched:", data);
      setInspecciones(data);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las inspecciones.",
        variant: "destructive",
      });
    }
  };

  const handleAddProblema = () => {
    setProblemas([
      ...problemas,
      { descripcion: "", evidencias: [], reportesSecundarios: [] },
    ]);
  };

  const handleRemoveProblema = (index: number) => {
    setProblemas(problemas.filter((_, i) => i !== index));
  };

  const handleProblemaChange = (
    index: number,
    field: keyof Problema,
    value: string | File[]
  ) => {
    const updatedProblemas = [...problemas];
    if (field === "evidencias" || field === "reportesSecundarios") {
      updatedProblemas[index][field] = value as File[];
    } else {
      updatedProblemas[index][field] = value as string;
    }
    setProblemas(updatedProblemas);
  };

  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    simulateUploadProgress();

    try {
      const formData = new FormData();
      formData.append("actividadId", selectedActividad);
      formData.append("observaciones", observaciones);
      formData.append("problemas", JSON.stringify(problemas));

      problemas.forEach((problema, index) => {
        problema.evidencias.forEach((file, fileIndex) => {
          formData.append(`problema${index}_evidencia${fileIndex}`, file);
        });
        problema.reportesSecundarios.forEach((file, fileIndex) => {
          formData.append(`problema${index}_reporte${fileIndex}`, file);
        });
      });

      const response = await fetch(`/api/obras/${obraId}/inspecciones`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al registrar la inspección");
      }

      toast({
        title: "Éxito",
        description: "Inspección registrada correctamente.",
        variant: "success",
      });
      setSelectedActividad("");
      setObservaciones("");
      setProblemas([]);
      fetchInspecciones();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo registrar la inspección.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "En Proceso":
        return "bg-blue-100 text-blue-800";
      case "Completada":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Fecha no disponible";
      }
      return format(date, "dd/MM/yyyy");
    } catch {
      return "Fecha no disponible";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <ClipboardCheck className="h-5 w-5 text-blue-600" />
            <CardTitle>Monitoreo e Inspección</CardTitle>
          </div>
          <CardDescription>
            Registro detallado de inspecciones y problemas en las actividades de
            la obra
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="actividad"
                  className="flex items-center space-x-2"
                >
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>Actividad a Inspeccionar</span>
                </Label>
                <Select
                  value={selectedActividad}
                  onValueChange={setSelectedActividad}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar actividad" />
                  </SelectTrigger>
                  <SelectContent>
                    {actividades.map((actividadObra) => (
                      <SelectItem
                        key={actividadObra._id}
                        value={actividadObra._id}
                      >
                        {actividadObra.actividad.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="observaciones"
                  className="flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span>Observaciones Generales</span>
                </Label>
                <Textarea
                  id="observaciones"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Ingrese observaciones detalladas de la inspección"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-4">
                <Label className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span>Problemas Detectados</span>
                </Label>
                {problemas.map((problema, index) => (
                  <Card key={index} className="border-blue-100">
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-sm text-blue-700">
                          Problema {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProblema(index)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2 space-y-4">
                      <Textarea
                        value={problema.descripcion}
                        onChange={(e) =>
                          handleProblemaChange(
                            index,
                            "descripcion",
                            e.target.value
                          )
                        }
                        placeholder="Descripción detallada del problema"
                        className="min-h-[80px]"
                      />
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label
                            htmlFor={`evidencias-${index}`}
                            className="flex items-center space-x-2"
                          >
                            <Upload className="h-4 w-4 text-blue-600" />
                            <span>Evidencias</span>
                          </Label>
                          <Input
                            id={`evidencias-${index}`}
                            type="file"
                            multiple
                            onChange={(e) =>
                              handleProblemaChange(
                                index,
                                "evidencias",
                                Array.from(e.target.files || [])
                              )
                            }
                            className="cursor-pointer"
                          />
                          {problema.evidencias.length > 0 && (
                            <p className="text-sm text-gray-500">
                              {problema.evidencias.length} archivo(s)
                              seleccionado(s)
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor={`reportes-${index}`}
                            className="flex items-center space-x-2"
                          >
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span>Reportes Secundarios</span>
                          </Label>
                          <Input
                            id={`reportes-${index}`}
                            type="file"
                            multiple
                            onChange={(e) =>
                              handleProblemaChange(
                                index,
                                "reportesSecundarios",
                                Array.from(e.target.files || [])
                              )
                            }
                            className="cursor-pointer"
                          />
                          {problema.reportesSecundarios.length > 0 && (
                            <p className="text-sm text-gray-500">
                              {problema.reportesSecundarios.length} archivo(s)
                              seleccionado(s)
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddProblema}
                  className="w-full border-dashed border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                >
                  <Plus className="mr-2 h-4 w-4" /> Añadir Problema
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-center text-gray-500">
                Subiendo archivos... {uploadProgress}%
              </p>
            </div>
          )}
          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando Inspección...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Registrar Inspección
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <ClipboardCheck className="h-5 w-5 text-blue-600" />
            <CardTitle>Inspecciones Registradas</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Actividad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Problemas</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspecciones.map((inspeccion) => (
                <TableRow key={inspeccion._id}>
                  <TableCell>{formatDate(inspeccion.fecha)}</TableCell>
                  <TableCell>
                    {inspeccion.actividadId
                      ? inspeccion.actividadId.nombre
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge className={getEstadoBadgeColor(inspeccion.estado)}>
                      {inspeccion.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-50">
                      {inspeccion.problemas.length} problema(s)
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-purple-50"
                    >
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
