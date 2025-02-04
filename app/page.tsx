"use client";

import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Navbar } from "@/components/layout/Navbar";
import { ObrasTable } from "@/components/obras/ObrasTable";
import { ObraDetails } from "@/components/obras/ObraDetails";
import { CrearObraForm } from "@/components/obras/CrearObraForm";
import { ObrasMapa } from "@/components/obras/ObrasMapa";
import { InformacionGeneral } from "@/components/dashboard/InformacionGeneral";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { SearchBar } from "@/components/common/SearchBar";
import { Sidebar } from "@/components/layout/SideBar";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedObra, setSelectedObra] = useState(null);
  const [showCrearForm, setShowCrearForm] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");

  const handleLogin = (credentials: {
    cedula: string;
    ruc: string;
    username: string;
    password: string;
  }) => {
    console.log("Credenciales:", credentials);
    setIsLoggedIn(true);
  };

  const handleObraCreated = () => {
    setShowCrearForm(false);
  };

  const handleSearch = (query: string) => {
    console.log("Buscando:", query);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "home":
        return (
          <>
            <div className="mb-4 space-y-4">
              <div className="flex justify-between items-center">
                <Button
                  onClick={() => setShowCrearForm(true)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-600"
                >
                  <Plus className="mr-2 h-4 w-4" /> Crear Nueva Obra
                </Button>
                <div className="w-1/2">
                  <SearchBar onSearch={handleSearch} />
                </div>
              </div>
            </div>
            {selectedObra ? (
              <ObraDetails
                obra={selectedObra}
                onBack={() => setSelectedObra(null)}
              />
            ) : showCrearForm ? (
              <CrearObraForm
                onObraCreated={handleObraCreated}
                onCancel={() => setShowCrearForm(false)}
              />
            ) : (
              <ObrasTable onSelectObra={setSelectedObra} />
            )}
          </>
        );
      case "map":
        return <ObrasMapa />;
      case "info":
        return <InformacionGeneral />;
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <ToastProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar onNavigate={setCurrentPage} />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
            {renderContent()}
          </main>
        </div>
      </div>
      <Toaster />
    </ToastProvider>
  );
}
