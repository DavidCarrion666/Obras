"use client";

import { useState } from "react";
import { ObrasTable } from "@/components/obras-table";
import { ObraDetails } from "@/components/obra-details";
import { CrearObraForm } from "@/components/crear-obra-form";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [selectedObra, setSelectedObra] = useState(null);
  const [showCrearForm, setShowCrearForm] = useState(false);

  const handleObraCreated = () => {
    setShowCrearForm(false);
    // Aquí podrías actualizar la lista de obras si es necesario
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sistema de Gestión de Obras</h1>
      {selectedObra ? (
        <ObraDetails obra={selectedObra} onBack={() => setSelectedObra(null)} />
      ) : showCrearForm ? (
        <CrearObraForm
          onObraCreated={handleObraCreated}
          onCancel={() => setShowCrearForm(false)}
        />
      ) : (
        <>
          <Button onClick={() => setShowCrearForm(true)} className="mb-4">
            Crear Nueva Obra
          </Button>
          <ObrasTable onSelectObra={setSelectedObra} />
        </>
      )}
    </div>
  );
}
