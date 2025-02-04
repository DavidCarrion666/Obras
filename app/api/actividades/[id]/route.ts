import type { NextRequest } from "next/server";
import {
  obtenerActividad,
  actualizarActividad,
  eliminarActividad,
} from "@/controllers/actividadController";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return obtenerActividad(params.id);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  return actualizarActividad(params.id, data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return eliminarActividad(params.id);
}
