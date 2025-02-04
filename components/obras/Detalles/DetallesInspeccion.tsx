import { format, isValid, parseISO } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, AlertCircle } from "lucide-react";

interface Problema {
  descripcion: string;
  evidencias: string[];
  reportesSecundarios: string[];
}

interface Inspeccion {
  _id: string;
  actividadId: {
    _id: string;
    nombre: string;
    descripcion: string;
    fechaInicio: string | undefined;
    fechaFin: string | undefined;
  };
  fecha: string;
  observaciones: string;
  problemas: Problema[];
  estado: "Pendiente" | "En Proceso" | "Completada";
}

interface DetallesInspeccionProps {
  inspeccion: Inspeccion;
}

export function DetallesInspeccion({ inspeccion }: DetallesInspeccionProps) {
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
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Detalles de la Inspección</CardTitle>
        <CardDescription>
          Inspección realizada el {formatDate(inspeccion.fecha)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Actividad</h3>
            <p>{inspeccion.actividadId.nombre}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Estado</h3>
            <Badge className={getEstadoBadgeColor(inspeccion.estado)}>
              {inspeccion.estado}
            </Badge>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Fecha de Inicio de Actividad</h3>
            <p>{formatDate(inspeccion.actividadId?.fechaInicio)}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Fecha de Fin de Actividad</h3>
            <p>{formatDate(inspeccion.actividadId?.fechaFin)}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2 flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Observaciones
          </h3>
          <p>{inspeccion.observaciones || "Sin observaciones"}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2 flex items-center">
            <AlertCircle className="mr-2 h-4 w-4" />
            Problemas Detectados
          </h3>
          {inspeccion.problemas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Evidencias</TableHead>
                  <TableHead>Reportes Secundarios</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inspeccion.problemas.map((problema, index) => (
                  <TableRow key={index}>
                    <TableCell>{problema.descripcion}</TableCell>
                    <TableCell>
                      {problema.evidencias.map((evidencia, i) => (
                        <a
                          key={i}
                          href={evidencia}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline block"
                        >
                          Evidencia {i + 1}
                        </a>
                      ))}
                    </TableCell>
                    <TableCell>
                      {problema.reportesSecundarios.map((reporte, i) => (
                        <a
                          key={i}
                          href={reporte}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline block"
                        >
                          Reporte {i + 1}
                        </a>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No se detectaron problemas en esta inspección.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
