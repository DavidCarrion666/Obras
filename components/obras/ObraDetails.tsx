"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Recursos } from "./detalles/Recursos";
import { Presupuesto } from "./detalles/Presupuesto";
import { Contratos } from "./detalles/Contratos";
import { Inspeccion } from "./detalles/Inspeccion";
import { Incidencias } from "./detalles/Incidencias";

interface Obra {
  _id: string;
  nombreObra: string;
  ubicacion: string;
  fecha_inicio: string;
  estadoObra: string;
}

interface ObraDetailsProps {
  obra: Obra;
  onBack: () => void;
}

export function ObraDetails({ obra, onBack }: ObraDetailsProps) {
  return (
    <div>
      <Button onClick={onBack} className="mb-4">
        Volver a la lista
      </Button>
      <h2 className="text-2xl font-bold mb-4">{obra.nombreObra}</h2>
      <Tabs defaultValue="recursos">
        <TabsList>
          <TabsTrigger value="recursos">Recursos</TabsTrigger>
          <TabsTrigger value="presupuesto">Presupuesto</TabsTrigger>
          <TabsTrigger value="contratos">Contratos</TabsTrigger>
          <TabsTrigger value="inspeccion">Inspección</TabsTrigger>
          <TabsTrigger value="incidencias">Incidencias</TabsTrigger>
        </TabsList>
        <TabsContent value="recursos">
          <Recursos obraId={obra._id} />
        </TabsContent>
        <TabsContent value="presupuesto">
          <Presupuesto obraId={obra._id} />
        </TabsContent>
        <TabsContent value="contratos">
          <Contratos obraId={obra._id} />
        </TabsContent>
        <TabsContent value="inspeccion">
          <Inspeccion obraId={obra._id} />
        </TabsContent>
        <TabsContent value="incidencias">
          <Incidencias obraId={obra._id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
