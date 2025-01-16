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
import { useToast } from "@/hooks/use-toast";

interface Contrato {
  _id: string;
  tipoContrato: "Principal" | "Complementario" | "Otros";
  nombreContratista: string;
  monto: number;
  fechaContrato: string;
  fechaFinContrato: string;
  fuenteFinanciamiento:
    | "Recursos Fiscales"
    | "Crédito interno"
    | "Crédito externo"
    | "Asistencia Técnica y Donaciones"
    | "R. Fiscales / Otros";
  entidadFinanciamiento: string;
  avanceContrato: number;
}

interface ContratosProps {
  obraId: string;
}

export function Contratos({ obraId }: ContratosProps) {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [nuevoContrato, setNuevoContrato] = useState<Partial<Contrato>>({
    tipoContrato: "Principal",
    nombreContratista: "",
    monto: 0,
    fechaContrato: "",
    fechaFinContrato: "",
    fuenteFinanciamiento: "Recursos Fiscales",
    entidadFinanciamiento: "",
    avanceContrato: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchContratos();
  }, [obraId]);

  const fetchContratos = async () => {
    try {
      const response = await fetch(`/api/obras/${obraId}/contratos`);
      if (response.ok) {
        const data = await response.json();
        setContratos(data);
      } else {
        throw new Error("Error al obtener los contratos");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los contratos.",
        variant: "destructive",
      });
    }
  };

  const handleNuevoContrato = async () => {
    try {
      const response = await fetch(`/api/obras/${obraId}/contratos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoContrato),
      });

      if (response.ok) {
        const createdContrato = await response.json();
        setContratos([...contratos, createdContrato]);
        setNuevoContrato({
          tipoContrato: "Principal",
          nombreContratista: "",
          monto: 0,
          fechaContrato: "",
          fechaFinContrato: "",
          fuenteFinanciamiento: "Recursos Fiscales",
          entidadFinanciamiento: "",
          avanceContrato: 0,
        });
        toast({
          title: "Éxito",
          description: "Contrato registrado correctamente.",
          variant: "success",
        });
      } else {
        throw new Error("Error al crear el contrato");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo registrar el contrato.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoContrato({ ...nuevoContrato, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNuevoContrato({ ...nuevoContrato, [name]: value });
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
              <Label htmlFor="tipoContrato">Tipo de Contrato</Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("tipoContrato", value)
                }
                value={nuevoContrato.tipoContrato}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Principal">Principal</SelectItem>
                  <SelectItem value="Complementario">Complementario</SelectItem>
                  <SelectItem value="Otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="nombreContratista">Nombre del Contratista</Label>
              <Input
                id="nombreContratista"
                name="nombreContratista"
                value={nuevoContrato.nombreContratista}
                onChange={handleInputChange}
                placeholder="Ingrese nombre del contratista"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monto">Monto (USD)</Label>
              <Input
                id="monto"
                name="monto"
                type="number"
                value={nuevoContrato.monto}
                onChange={handleInputChange}
                placeholder="Ingrese monto"
              />
            </div>
            <div>
              <Label htmlFor="fechaContrato">Fecha de Contrato</Label>
              <Input
                id="fechaContrato"
                name="fechaContrato"
                type="date"
                value={nuevoContrato.fechaContrato}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fechaFinContrato">Fecha Fin de Contrato</Label>
              <Input
                id="fechaFinContrato"
                name="fechaFinContrato"
                type="date"
                value={nuevoContrato.fechaFinContrato}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="fuenteFinanciamiento">
                Fuente de Financiamiento
              </Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("fuenteFinanciamiento", value)
                }
                value={nuevoContrato.fuenteFinanciamiento}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar fuente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Recursos Fiscales">
                    Recursos Fiscales
                  </SelectItem>
                  <SelectItem value="Crédito interno">
                    Crédito interno
                  </SelectItem>
                  <SelectItem value="Crédito externo">
                    Crédito externo
                  </SelectItem>
                  <SelectItem value="Asistencia Técnica y Donaciones">
                    Asistencia Técnica y Donaciones
                  </SelectItem>
                  <SelectItem value="R. Fiscales / Otros">
                    R. Fiscales / Otros
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entidadFinanciamiento">
                Entidad de Financiamiento
              </Label>
              <Input
                id="entidadFinanciamiento"
                name="entidadFinanciamiento"
                value={nuevoContrato.entidadFinanciamiento}
                onChange={handleInputChange}
                placeholder="Ingrese entidad de financiamiento"
              />
            </div>
            <div>
              <Label htmlFor="avanceContrato">Avance del Contrato (%)</Label>
              <Input
                id="avanceContrato"
                name="avanceContrato"
                type="number"
                min="0"
                max="100"
                value={nuevoContrato.avanceContrato}
                onChange={handleInputChange}
                placeholder="Ingrese avance del contrato"
              />
            </div>
          </div>
          <Button
            onClick={handleNuevoContrato}
            className="bg-blue-100 hover:bg-blue-200 text-blue-600"
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
                <TableHead>Contratista</TableHead>
                <TableHead>Monto (USD)</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Fecha Fin</TableHead>
                <TableHead>Avance (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contratos.map((contrato) => (
                <TableRow key={contrato._id}>
                  <TableCell>{contrato.tipoContrato}</TableCell>
                  <TableCell>{contrato.nombreContratista}</TableCell>
                  <TableCell>{contrato.monto.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(contrato.fechaContrato).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(contrato.fechaFinContrato).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{contrato.avanceContrato}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
