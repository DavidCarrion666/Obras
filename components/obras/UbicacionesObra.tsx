import { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";

interface Ubicacion {
  nombre: string;
  latitud: number;
  longitud: number;
}

interface UbicacionesObraProps {
  obraId: string;
  ubicaciones: Ubicacion[];
  onUbicacionAdded: () => void;
  onClose: () => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const center = {
  lat: -1.831239,
  lng: -78.183406,
};

export function UbicacionesObra({
  obraId,
  ubicaciones,
  onUbicacionAdded,
  onClose,
}: UbicacionesObraProps) {
  const [newUbicacion, setNewUbicacion] = useState<Ubicacion>({
    nombre: "",
    latitud: 0,
    longitud: 0,
  });
  const [selectedLocation, setSelectedLocation] = useState<Ubicacion | null>(
    null
  );
  const { toast } = useToast();

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setNewUbicacion((prev) => ({
        ...prev,
        latitud: event.latLng!.lat(),
        longitud: event.latLng!.lng(),
      }));
    }
  };

  const handleAddUbicacion = async () => {
    if (
      !newUbicacion.nombre ||
      newUbicacion.latitud === 0 ||
      newUbicacion.longitud === 0
    ) {
      toast({
        title: "Error",
        description: "Por favor, complete todos los campos de la ubicación.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/obras/${obraId}/ubicaciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUbicacion),
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Ubicación añadida correctamente.",
          variant: "success",
        });
        setNewUbicacion({ nombre: "", latitud: 0, longitud: 0 });
        onUbicacionAdded();
      } else {
        throw new Error("Error al añadir la ubicación");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo añadir la ubicación.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] sm:h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Ubicaciones de la Obra</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <LoadScript googleMapsApiKey="AIzaSyCpbRtt69a1VFC0V8oXHF4uOvh_aDf0XzQ">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={6}
              onClick={handleMapClick}
            >
              {ubicaciones.map((ubicacion, index) => (
                <Marker
                  key={index}
                  position={{ lat: ubicacion.latitud, lng: ubicacion.longitud }}
                  onClick={() => setSelectedLocation(ubicacion)}
                />
              ))}
              {selectedLocation && (
                <InfoWindow
                  position={{
                    lat: selectedLocation.latitud,
                    lng: selectedLocation.longitud,
                  }}
                  onCloseClick={() => setSelectedLocation(null)}
                >
                  <div>
                    <h3>{selectedLocation.nombre}</h3>
                    <p>
                      Lat: {selectedLocation.latitud}, Lng:{" "}
                      {selectedLocation.longitud}
                    </p>
                  </div>
                </InfoWindow>
              )}
              {newUbicacion.latitud !== 0 && newUbicacion.longitud !== 0 && (
                <Marker
                  position={{
                    lat: newUbicacion.latitud,
                    lng: newUbicacion.longitud,
                  }}
                  title="Nueva ubicación"
                />
              )}
            </GoogleMap>
          </LoadScript>
          <div className="mt-4">
            <h3>Todas las Ubicaciones</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Latitud</TableHead>
                  <TableHead>Longitud</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ubicaciones.map((ubicacion, index) => (
                  <TableRow key={index}>
                    <TableCell>{ubicacion.nombre}</TableCell>
                    <TableCell>{ubicacion.latitud}</TableCell>
                    <TableCell>{ubicacion.longitud}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nombre-ubicacion">Nombre de la ubicación</Label>
            <Input
              id="nombre-ubicacion"
              placeholder="Nombre de la ubicación"
              value={newUbicacion.nombre}
              onChange={(e) =>
                setNewUbicacion((prev) => ({ ...prev, nombre: e.target.value }))
              }
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="latitud">Latitud</Label>
              <Input
                id="latitud"
                type="number"
                placeholder="Latitud"
                value={newUbicacion.latitud || ""}
                onChange={(e) =>
                  setNewUbicacion((prev) => ({
                    ...prev,
                    latitud: parseFloat(e.target.value),
                  }))
                }
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="longitud">Longitud</Label>
              <Input
                id="longitud"
                type="number"
                placeholder="Longitud"
                value={newUbicacion.longitud || ""}
                onChange={(e) =>
                  setNewUbicacion((prev) => ({
                    ...prev,
                    longitud: parseFloat(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          <Button
            onClick={handleAddUbicacion}
            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-600"
          >
            Añadir Ubicación
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
