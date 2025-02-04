import type { NextRequest } from "next/server";
import {
  crearActividad,
  obtenerActividades,
} from "@/controllers/actividadController";

export async function POST(request: NextRequest) {
  const data = await request.json();
  return crearActividad(data);
}

export async function GET() {
  return obtenerActividades();
}
