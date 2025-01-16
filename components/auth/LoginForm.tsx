"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { LogIn } from "lucide-react";

interface LoginFormProps {
  onLogin: (credentials: {
    cedula: string;
    ruc: string;
    username: string;
    password: string;
  }) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [credentials, setCredentials] = useState({
    cedula: "",
    ruc: "",
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(credentials);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-white">
      <Card className="m-auto w-full max-w-4xl flex overflow-hidden">
        <CardContent className="flex-1 p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-2xl font-bold text-blue-800">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-blue-600">
              Ingrese sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cedula" className="text-blue-700">
                Cédula
              </Label>
              <Input
                id="cedula"
                name="cedula"
                type="text"
                required
                onChange={handleChange}
                className="border-blue-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ruc" className="text-blue-700">
                RUC de la Entidad
              </Label>
              <Input
                id="ruc"
                name="ruc"
                type="text"
                required
                onChange={handleChange}
                className="border-blue-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-blue-700">
                Nombre de Usuario
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                onChange={handleChange}
                className="border-blue-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-700">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                onChange={handleChange}
                className="border-blue-300 focus:border-blue-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-100 hover:bg-blue-200 text-blue-600"
            >
              <LogIn className="mr-2 h-4 w-4" /> Ingresar
            </Button>
          </form>
        </CardContent>
        <div className="flex-1 relative">
          <Image
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvbnN0cnVjdGlvbnxlbnwwfHwwfHx8MA%3D%3D"
            alt="Construction Site"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </Card>
    </div>
  );
}
