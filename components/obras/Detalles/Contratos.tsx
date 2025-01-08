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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Contrato {
  id: string;
  tipo: string;
  detalles: string;
  fechaFirma: string;
  pdfUrl: string;
}

export function Contratos() {
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
  const [nuevoContrato, setNuevoContrato] = useState({
    tipo: "",
    detalles: "",
  });

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

  return (
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
                  <SelectItem value="instalaciones">Instalaciones</SelectItem>
                  <SelectItem value="servicios">Servicios</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="detalles-contrato">Detalles del Contrato</Label>
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
          <Button
            onClick={handleNuevoContrato}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
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
  );
}
