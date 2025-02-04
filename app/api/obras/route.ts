import type { NextRequest } from "next/server";
import { crearObra, obtenerObras } from "@/controllers/obraController";

export async function POST(request: NextRequest) {
  const data = await request.json();
  return crearObra(data);
}

export async function GET() {
  return obtenerObras();
}
