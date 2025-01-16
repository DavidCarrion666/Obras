import { Button } from "@/components/ui/button";
import { MapPin, BarChart2, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SidebarProps {
  onNavigate: (page: string) => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <div className="bg-gray-50 text-gray-700 w-64 h-full flex flex-col py-7 px-4">
      <div className="mb-6 flex flex-col items-center space-y-4">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-S8K6Pa8ABQkqcAH7fNJ9rENAO5YZlW.png"
          alt="Escudo de Ecuador"
          width={100}
          height={100}
          className="mb-4"
        />
        <div className="h-[1px] w-full bg-gray-200" />
      </div>
      <nav className="flex-grow space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start mb-2 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
          onClick={() => onNavigate("home")}
        >
          <Home className="mr-2 h-4 w-4" />
          Inicio
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start mb-2 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
          onClick={() => onNavigate("map")}
        >
          <MapPin className="mr-2 h-4 w-4" />
          Obras en el Mapa
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start mb-2 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
          onClick={() => onNavigate("info")}
        >
          <BarChart2 className="mr-2 h-4 w-4" />
          Información General
        </Button>
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-200">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagen_2025-01-15_222154845-kdi5OHwbZPbUuPYWLb0nNH7wNlNgLi.png"
          alt="Gobierno del Encuentro"
          width={150}
          height={50}
          className="opacity-50"
        />
      </div>
    </div>
  );
}
