"use client";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";

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
  const [formData, setFormData] = useState<Partial<Contrato>>({
    tipoContrato: "Principal",
    nombreContratista: "",
    monto: 0,
    fechaContrato: "",
    fechaFinContrato: "",
    fuenteFinanciamiento: "Recursos Fiscales",
    entidadFinanciamiento: "",
    avanceContrato: 0,
  });
  const [editingContratoId, setEditingContratoId] = useState<string | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contratoToDelete, setContratoToDelete] = useState<Contrato | null>(
    null
  );
  const { toast } = useToast();

  useEffect(() => {
    fetchContratos();
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingContratoId
        ? `/api/obras/${obraId}/contratos/${editingContratoId}`
        : `/api/obras/${obraId}/contratos`;
      const method = editingContratoId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (editingContratoId) {
          setContratos(contratos.map((c) => (c._id === data._id ? data : c)));
          setEditingContratoId(null);
          resetForm();
        } else {
          setContratos([...contratos, data]);
        }
        toast({
          title: "Éxito",
          description: editingContratoId
            ? "Contrato actualizado correctamente."
            : "Contrato registrado correctamente.",
          variant: "success",
        });
      } else {
        throw new Error(
          editingContratoId
            ? "Error al actualizar el contrato"
            : "Error al crear el contrato"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: editingContratoId
          ? "No se pudo actualizar el contrato."
          : "No se pudo registrar el contrato.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (contrato: Contrato) => {
    setFormData({
      tipoContrato: contrato.tipoContrato,
      nombreContratista: contrato.nombreContratista,
      monto: contrato.monto,
      fechaContrato: contrato.fechaContrato.split("T")[0], // Formatear la fecha para el input
      fechaFinContrato: contrato.fechaFinContrato.split("T")[0], // Formatear la fecha para el input
      fuenteFinanciamiento: contrato.fuenteFinanciamiento,
      entidadFinanciamiento: contrato.entidadFinanciamiento,
      avanceContrato: contrato.avanceContrato,
    });
    setEditingContratoId(contrato._id);
  };

  const handleDelete = (contrato: Contrato) => {
    setContratoToDelete(contrato);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!contratoToDelete) return;

    try {
      const response = await fetch(
        `/api/obras/${obraId}/contratos/${contratoToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setContratos(contratos.filter((c) => c._id !== contratoToDelete._id));
        setIsDeleteDialogOpen(false);
        setContratoToDelete(null);
        toast({
          title: "Éxito",
          description: "Contrato eliminado correctamente.",
          variant: "success",
        });
      } else {
        throw new Error("Error al eliminar el contrato");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el contrato.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      tipoContrato: "Principal",
      nombreContratista: "",
      monto: 0,
      fechaContrato: "",
      fechaFinContrato: "",
      fuenteFinanciamiento: "Recursos Fiscales",
      entidadFinanciamiento: "",
      avanceContrato: 0,
    });
    setEditingContratoId(null);
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
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipoContrato">Tipo de Contrato</Label>
              <Select
                value={formData.tipoContrato}
                onValueChange={(value) =>
                  handleSelectChange("tipoContrato", value)
                }
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
                value={formData.nombreContratista}
                onChange={handleInputChange}
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
                value={formData.monto}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="fechaContrato">Fecha de Contrato</Label>
              <Input
                id="fechaContrato"
                name="fechaContrato"
                type="date"
                value={formData.fechaContrato}
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
                value={formData.fechaFinContrato}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="fuenteFinanciamiento">
                Fuente de Financiamiento
              </Label>
              <Select
                value={formData.fuenteFinanciamiento}
                onValueChange={(value) =>
                  handleSelectChange("fuenteFinanciamiento", value)
                }
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
                value={formData.entidadFinanciamiento}
                onChange={handleInputChange}
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
                value={formData.avanceContrato}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancelar {editingContratoId ? "Edición" : ""}
            </Button>
            <Button type="submit">
              {editingContratoId ? "Actualizar Contrato" : "Registrar Contrato"}
            </Button>
          </div>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Contratista</TableHead>
              <TableHead>Monto (USD)</TableHead>
              <TableHead>Fecha Inicio</TableHead>
              <TableHead>Fecha Fin</TableHead>
              <TableHead>Avance (%)</TableHead>
              <TableHead>Acciones</TableHead>
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
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(contrato)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(contrato)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
            </DialogHeader>
            <p>¿Está seguro de que desea eliminar este contrato?</p>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={confirmDelete}
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
