import Image from "next/image";

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 text-gray-800 p-4 w-full">
      <div className="container mx-auto flex items-center">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagen_2025-01-15_222154845-kdi5OHwbZPbUuPYWLb0nNH7wNlNgLi.png"
          alt="Gobierno del Encuentro"
          width={200}
          height={60}
          className="mr-4"
        />
        <h1 className="text-2xl font-bold text-gray-700">
          Sistema de Gestión de Obras
        </h1>
      </div>
    </nav>
  );
}
