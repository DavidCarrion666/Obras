"use client";

import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Checkbox } from "../components/ui/checkbox";
import { Switch } from "../components/ui/switch";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface Obra {
  _id: string;
  nombre: string;
  ubicacion: string;
  fecha_inicio: string;
  estado: string;
}

interface Actividad {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  observacion: string;
  completada: boolean;
}

interface Contrato {
  id: string;
  tipo: string;
  detalles: string;
  fechaFirma: string;
  pdfUrl: string;
}

interface Incidencia {
  id: string;
  descripcion: string;
  fecha: string;
  estado: string;
  observaciones: string;
  documentos: string[];
}

interface ObraDetailsProps {
  obra: Obra;
  onBack: () => void;
}

export function ObraDetails({ obra, onBack }: ObraDetailsProps) {
  const [actividades, setActividades] = useState<Actividad[]>([
    {
      id: "1",
      nombre: "Preparación del terreno",
      fechaInicio: "2024-01-01",
      fechaFin: "2024-01-15",
      observacion: "",
      completada: false,
    },
    {
      id: "2",
      nombre: "Cimentación",
      fechaInicio: "2024-01-16",
      fechaFin: "2024-02-15",
      observacion: "",
      completada: false,
    },
    {
      id: "3",
      nombre: "Estructura",
      fechaInicio: "2024-02-16",
      fechaFin: "2024-04-15",
      observacion: "",
      completada: false,
    },
    {
      id: "4",
      nombre: "Acabados",
      fechaInicio: "2024-04-16",
      fechaFin: "2024-06-15",
      observacion: "",
      completada: false,
    },
  ]);

  const [presupuesto, setPresupuesto] = useState(1000000);
  const [ponderacionActiva, setPonderacionActiva] = useState(false);

  const [contratos, setContratos] = useState<Contrato[]>([
    {
      id: "1",
      tipo: "Obra Civil",
      detalles: "Contrato para la construcción de la estructura principal",
      fechaFirma: "2024-01-01",
      pdfUrl: "/contratos/contrato1.pdf",
    },
    {
      id: "2",
      tipo: "Instalaciones Eléctricas",
      detalles: "Contrato para la instalación del sistema eléctrico",
      fechaFirma: "2024-02-15",
      pdfUrl: "/contratos/contrato2.pdf",
    },
  ]);

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

  const [nuevoContrato, setNuevoContrato] = useState({
    tipo: "",
    detalles: "",
  });
  const [nuevaIncidencia, setNuevaIncidencia] = useState({
    descripcion: "",
    observaciones: "",
  });

  const handleObservacionChange = (id: string, observacion: string) => {
    setActividades(
      actividades.map((act) => (act.id === id ? { ...act, observacion } : act))
    );
  };

  const handleCompletadaChange = (id: string, completada: boolean) => {
    setActividades(
      actividades.map((act) => (act.id === id ? { ...act, completada } : act))
    );
  };

  const actividadesCompletadas = actividades.filter((act) => act.completada);
  const actividadesPendientes = actividades.filter((act) => !act.completada);

  const handleNuevoContrato = () => {
    const newId = (contratos.length + 1).toString();
    setContratos([
      ...contratos,
      {
        ...nuevoContrato,
        id: newId,
        fechaFirma: new Date().toISOString().split("T")[0],
        pdfUrl: `/contratos/contrato${newId}.pdf`,
      },
    ]);
    setNuevoContrato({ tipo: "", detalles: "" });
  };

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
    <div>
      <Button onClick={onBack} className="mb-4">
        Volver a la lista
      </Button>
      <h2 className="text-2xl font-bold mb-4">{obra.nombre}</h2>
      <Tabs defaultValue="recursos">
        <TabsList>
          <TabsTrigger value="recursos">Recursos</TabsTrigger>
          <TabsTrigger value="presupuesto">Presupuesto</TabsTrigger>
          <TabsTrigger value="contratos">Contratos</TabsTrigger>
          <TabsTrigger value="inspeccion">Inspección</TabsTrigger>
          <TabsTrigger value="incidencias">Incidencias</TabsTrigger>
        </TabsList>
        <TabsContent value="recursos">
          <Card>
            <CardHeader>
              <CardTitle>Cronograma de Actividades</CardTitle>
              <CardDescription>
                Seguimiento de actividades y recursos asignados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Actividad</TableHead>
                    <TableHead>Fecha Inicio</TableHead>
                    <TableHead>Fecha Fin</TableHead>
                    <TableHead>Observación</TableHead>
                    <TableHead>Completada</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actividades.map((actividad) => (
                    <TableRow key={actividad.id}>
                      <TableCell>{actividad.nombre}</TableCell>
                      <TableCell>{actividad.fechaInicio}</TableCell>
                      <TableCell>{actividad.fechaFin}</TableCell>
                      <TableCell>
                        <Input
                          value={actividad.observacion}
                          onChange={(e) =>
                            handleObservacionChange(
                              actividad.id,
                              e.target.value
                            )
                          }
                          placeholder="Agregar observación"
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={actividad.completada}
                          onCheckedChange={(checked) =>
                            handleCompletadaChange(
                              actividad.id,
                              checked as boolean
                            )
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Comparativa de Actividades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">
                    Actividades Completadas ({actividadesCompletadas.length})
                  </h3>
                  <ul className="list-disc pl-5">
                    {actividadesCompletadas.map((act) => (
                      <li key={act.id}>{act.nombre}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    Actividades Pendientes ({actividadesPendientes.length})
                  </h3>
                  <ul className="list-disc pl-5">
                    {actividadesPendientes.map((act) => (
                      <li key={act.id}>{act.nombre}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="presupuesto">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Presupuesto</CardTitle>
              <CardDescription>
                Control y seguimiento del presupuesto de la obra
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="presupuesto-actual">Presupuesto Actual</Label>
                  <Input
                    id="presupuesto-actual"
                    type="number"
                    value={presupuesto}
                    onChange={(e) => setPresupuesto(Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ponderacion"
                    checked={ponderacionActiva}
                    onCheckedChange={setPonderacionActiva}
                  />
                  <Label htmlFor="ponderacion">Activar Ponderación</Label>
                </div>
                {ponderacionActiva && (
                  <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-semibold mb-2">
                      Ponderación de Actividades
                    </h4>
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
                          const montoAsignado =
                            presupuesto * (porcentaje / 100);
                          return (
                            <TableRow key={actividad.id}>
                              <TableCell>{actividad.nombre}</TableCell>
                              <TableCell>{porcentaje.toFixed(2)}%</TableCell>
                              <TableCell>${montoAsignado.toFixed(2)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contratos">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Contratos</CardTitle>
              <CardDescription>
                Registro y seguimiento de contratos de la obra
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo-contrato">Tipo de Contrato</Label>
                    <Select
                      onValueChange={(value) =>
                        setNuevoContrato({ ...nuevoContrato, tipo: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="obra-civil">Obra Civil</SelectItem>
                        <SelectItem value="instalaciones">
                          Instalaciones
                        </SelectItem>
                        <SelectItem value="servicios">Servicios</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="detalles-contrato">
                      Detalles del Contrato
                    </Label>
                    <Input
                      id="detalles-contrato"
                      value={nuevoContrato.detalles}
                      onChange={(e) =>
                        setNuevoContrato({
                          ...nuevoContrato,
                          detalles: e.target.value,
                        })
                      }
                      placeholder="Ingrese detalles del contrato"
                    />
                  </div>
                </div>
                <Button onClick={handleNuevoContrato}>
                  Registrar Nuevo Contrato
                </Button>
              </div>
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Contratos Registrados</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Detalles</TableHead>
                      <TableHead>Fecha de Firma</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contratos.map((contrato) => (
                      <TableRow key={contrato.id}>
                        <TableCell>{contrato.tipo}</TableCell>
                        <TableCell>{contrato.detalles}</TableCell>
                        <TableCell>{contrato.fechaFirma}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" asChild>
                            <a href={contrato.pdfUrl} download>
                              Descargar PDF
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inspeccion">
          <Card>
            <CardHeader>
              <CardTitle>Monitoreo e Inspección</CardTitle>
              <CardDescription>
                Validación de tareas, presupuestos y registro de problemas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tarea-inspeccion">Tarea a Inspeccionar</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tarea" />
                    </SelectTrigger>
                    <SelectContent>
                      {actividades.map((actividad) => (
                        <SelectItem key={actividad.id} value={actividad.id}>
                          {actividad.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="observacion-inspeccion">Observaciones</Label>
                  <Textarea
                    id="observacion-inspeccion"
                    placeholder="Ingrese observaciones de la inspección"
                  />
                </div>
                <div>
                  <Label htmlFor="evidencia-inspeccion">
                    Adjuntar Evidencia
                  </Label>
                  <Input id="evidencia-inspeccion" type="file" />
                </div>
                <Button>Registrar Inspección</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="incidencias">
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
                  <Label htmlFor="observaciones-incidencia">
                    Observaciones
                  </Label>
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
                  <Label htmlFor="documento-incidencia">
                    Adjuntar Documento
                  </Label>
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
                              onClick={() =>
                                handleCerrarIncidencia(incidencia.id)
                              }
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
