import { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Ubicacion {
  nombre: string;
  latitud: number;
  longitud: number;
}

interface Obra {
  _id: string;
  nombreObra: string;
  ubicaciones: Ubicacion[];
}

const mapContainerStyle = {
  width: "100%",
  height: "calc(100vh - 100px)",
};

const center = {
  lat: -1.831239,
  lng: -78.183406,
};

export function ObrasMapa() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [filteredObras, setFilteredObras] = useState<Obra[]>([]);
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchObras();
  }, []);

  useEffect(() => {
    const filtered = obras.filter((obra) =>
      obra.nombreObra.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredObras(filtered);
  }, [searchTerm, obras]);

  const fetchObras = async () => {
    try {
      const response = await fetch("/api/obras");
      if (response.ok) {
        const data = await response.json();
        setObras(data);
        setFilteredObras(data);
      } else {
        console.error("Failed to fetch obras");
      }
    } catch (error) {
      console.error("Error fetching obras:", error);
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Obras en el Mapa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label htmlFor="search">Buscar Obra</Label>
          <Input
            id="search"
            placeholder="Nombre de la obra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={6}
          >
            {filteredObras.map((obra) =>
              obra.ubicaciones.map((ubicacion, index) => (
                <Marker
                  key={`${obra._id}-${index}`}
                  position={{ lat: ubicacion.latitud, lng: ubicacion.longitud }}
                  onClick={() => setSelectedObra(obra)}
                />
              ))
            )}
            {selectedObra && (
              <InfoWindow
                position={{
                  lat: selectedObra.ubicaciones[0].latitud,
                  lng: selectedObra.ubicaciones[0].longitud,
                }}
                onCloseClick={() => setSelectedObra(null)}
              >
                <div>
                  <h3 className="font-bold">{selectedObra.nombreObra}</h3>
                  <p>Ubicaciones: {selectedObra.ubicaciones.length}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </CardContent>
    </Card>
  );
}
