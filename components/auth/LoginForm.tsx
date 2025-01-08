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
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Card className="m-auto w-full max-w-4xl flex overflow-hidden">
        <CardContent className="flex-1 p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-2xl font-bold text-purple-800">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-purple-600">
              Ingrese sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cedula" className="text-purple-700">
                Cédula
              </Label>
              <Input
                id="cedula"
                name="cedula"
                type="text"
                required
                onChange={handleChange}
                className="border-purple-300 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ruc" className="text-purple-700">
                RUC de la Entidad
              </Label>
              <Input
                id="ruc"
                name="ruc"
                type="text"
                required
                onChange={handleChange}
                className="border-purple-300 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-purple-700">
                Nombre de Usuario
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                onChange={handleChange}
                className="border-purple-300 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-purple-700">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                onChange={handleChange}
                className="border-purple-300 focus:border-purple-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <LogIn className="mr-2 h-4 w-4" /> Ingresar
            </Button>
          </form>
        </CardContent>
        <div className="flex-1 relative">
          <Image
            src="/placeholder.svg?height=600&width=400"
            alt="Login Image"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </Card>
    </div>
  );
}
