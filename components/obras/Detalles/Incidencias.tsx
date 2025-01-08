import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Incidencia {
  id: string;
  descripcion: string;
  fecha: string;
  estado: string;
  observaciones: string;
  documentos: string[];
}

export function Incidencias() {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([
    {
      id: "1",
      descripcion: "Retraso en entrega de materiales",
      fecha: "2024-02-01",
      estado: "Abierta",
      observaciones: "",
      documentos: [],
    },
    {
      id: "2",
      descripcion: "Falla en equipo de excavación",
      fecha: "2024-02-15",
      estado: "Cerrada",
      observaciones: "Se reparó el equipo",
      documentos: ["/documentos/reporte_falla.pdf"],
    },
  ]);
  const [nuevaIncidencia, setNuevaIncidencia] = useState({
    descripcion: "",
    observaciones: "",
  });

  const handleNuevaIncidencia = () => {
    const newId = (incidencias.length + 1).toString();
    setIncidencias([
      ...incidencias,
      {
        ...nuevaIncidencia,
        id: newId,
        fecha: new Date().toISOString().split("T")[0],
        estado: "Abierta",
        documentos: [],
      },
    ]);
    setNuevaIncidencia({ descripcion: "", observaciones: "" });
  };

  const handleCerrarIncidencia = (id: string) => {
    setIncidencias(
      incidencias.map((inc) =>
        inc.id === id ? { ...inc, estado: "Cerrada" } : inc
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Incidencias</CardTitle>
        <CardDescription>
          Registro y seguimiento de incidencias en la obra
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="descripcion-incidencia">
              Descripción de la Incidencia
            </Label>
            <Input
              id="descripcion-incidencia"
              value={nuevaIncidencia.descripcion}
              onChange={(e) =>
                setNuevaIncidencia({
                  ...nuevaIncidencia,
                  descripcion: e.target.value,
                })
              }
              placeholder="Describa la incidencia"
            />
          </div>
          <div>
            <Label htmlFor="observaciones-incidencia">Observaciones</Label>
            <Textarea
              id="observaciones-incidencia"
              value={nuevaIncidencia.observaciones}
              onChange={(e) =>
                setNuevaIncidencia({
                  ...nuevaIncidencia,
                  observaciones: e.target.value,
                })
              }
              placeholder="Ingrese observaciones sobre la incidencia"
            />
          </div>
          <div>
            <Label htmlFor="documento-incidencia">Adjuntar Documento</Label>
            <Input id="documento-incidencia" type="file" />
          </div>
          <Button onClick={handleNuevaIncidencia}>
            Registrar Nueva Incidencia
          </Button>
        </div>
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Incidencias Registradas</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidencias.map((incidencia) => (
                <TableRow key={incidencia.id}>
                  <TableCell>{incidencia.descripcion}</TableCell>
                  <TableCell>{incidencia.fecha}</TableCell>
                  <TableCell>{incidencia.estado}</TableCell>
                  <TableCell>
                    {incidencia.estado === "Abierta" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCerrarIncidencia(incidencia.id)}
                      >
                        Cerrar Incidencia
                      </Button>
                    )}
                    {incidencia.documentos.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="ml-2"
                      >
                        <a href={incidencia.documentos[0]} download>
                          Descargar Documento
                        </a>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
