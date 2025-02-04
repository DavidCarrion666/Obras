import type { NextRequest } from "next/server";
import {
  obtenerContrato,
  actualizarContrato,
  eliminarContrato,
} from "@/controllers/contratoController";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; contratoId: string } }
) {
  return obtenerContrato(params.contratoId);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; contratoId: string } }
) {
  const data = await request.json();
  return actualizarContrato(params.contratoId, data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; contratoId: string } }
) {
  return eliminarContrato(params.contratoId);
}
