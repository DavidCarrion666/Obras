import type { NextRequest } from "next/server";
import {
  obtenerObra,
  actualizarObra,
  eliminarObra,
} from "@/controllers/obraController";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return obtenerObra(params.id);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  return actualizarObra(params.id, data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return eliminarObra(params.id);
}
