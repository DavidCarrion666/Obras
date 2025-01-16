import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ActualizarObraForm } from "./ActualizarObraForm";
import { UbicacionesObra } from "./UbicacionesObra";
import { Edit, Eye, MapPin, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

interface Obra {
  _id: string;
  nombreObra: string;
  ubicaciones: { nombre: string; latitud: number; longitud: number }[];
  fecha_inicio: string;
  estadoObra: string;
  capacidadInfraestructura: string;
  categoria: string;
  descripcionObra: string;
  tipoIntervencion: string;
  cup: string;
  presupuesto: number;
}

interface ObrasTableProps {
  onSelectObra: (obra: Obra) => void;
}

export function ObrasTable({ onSelectObra }: ObrasTableProps) {
  const [obras, setObras] = useState<Obra[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showingUbicaciones, setShowingUbicaciones] = useState<Obra | null>(
    null
  );
  const { toast } = useToast();

  useEffect(() => {
    fetchObras();
  }, []);

  const fetchObras = async () => {
    try {
      const response = await fetch("/api/obras");
      if (!response.ok) {
        throw new Error("Error al cargar las obras");
      }
      const data = await response.json();
      setObras(data);
    } catch (error) {
      console.error("Error fetching obras:", error);
      setError(
        "No se pudieron cargar las obras. Por favor, intente de nuevo más tarde."
      );
    }
  };

  const handleUpdateObra = (obra: Obra) => {
    setSelectedObra(obra);
    setIsUpdating(true);
  };

  const handleObraActualizada = () => {
    setIsUpdating(false);
    setSelectedObra(null);
    fetchObras();
    toast({
      title: "Obra Actualizada",
      description: "La obra ha sido actualizada exitosamente.",
      variant: "success",
    });
  };

  const handleDeleteObra = async (obra: Obra) => {
    if (
      window.confirm(
        `¿Está seguro de que desea eliminar la obra "${obra.nombreObra}"?`
      )
    ) {
      try {
        const response = await fetch(`/api/obras/${obra._id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchObras();
          toast({
            title: "Obra Eliminada",
            description: "La obra ha sido eliminada exitosamente.",
            variant: "success",
          });
        } else {
          throw new Error("Error al eliminar la obra");
        }
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "No se pudo eliminar la obra.",
          variant: "destructive",
        });
      }
    }
  };

  const handleShowUbicaciones = (obra: Obra) => {
    setShowingUbicaciones(obra);
  };

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case "Planificación":
        return "bg-blue-100 text-blue-800";
      case "En Ejecución":
        return "bg-yellow-100 text-yellow-800";
      case "Completada":
        return "bg-green-100 text-green-800";
      case "Suspendida":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isUpdating && selectedObra) {
    return (
      <ActualizarObraForm
        obra={selectedObra}
        onObraActualizada={handleObraActualizada}
        onCancel={() => setIsUpdating(false)}
      />
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Fecha de Inicio</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {obras.map((obra) => (
            <TableRow key={obra._id}>
              <TableCell>{obra.nombreObra}</TableCell>
              <TableCell>
                {obra.ubicaciones.length > 0
                  ? obra.ubicaciones[0].nombre
                  : "Sin ubicación"}
              </TableCell>
              <TableCell>
                {new Date(obra.fecha_inicio).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge className={getBadgeColor(obra.estadoObra)}>
                  {obra.estadoObra}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => onSelectObra(obra)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleUpdateObra(obra)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={() => handleShowUbicaciones(obra)}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteObra(obra)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        open={showingUbicaciones !== null}
        onOpenChange={() => setShowingUbicaciones(null)}
      >
        {showingUbicaciones && (
          <UbicacionesObra
            obraId={showingUbicaciones._id}
            ubicaciones={showingUbicaciones.ubicaciones}
            onUbicacionAdded={fetchObras}
            onClose={() => setShowingUbicaciones(null)}
          />
        )}
      </Dialog>
    </>
  );
}
