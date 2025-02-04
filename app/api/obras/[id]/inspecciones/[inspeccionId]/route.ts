import { type NextRequest, NextResponse } from "next/server";
import {
  obtenerInspeccion,
  actualizarInspeccion,
  eliminarInspeccion,
} from "@/controllers/inspeccionController";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; inspeccionId: string } }
) {
  return obtenerInspeccion(params.inspeccionId);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; inspeccionId: string } }
) {
  try {
    const data = await request.json();
    console.log("Received update data:", data);
    return actualizarInspeccion(params.inspeccionId, data);
  } catch (error) {
    console.error(
      "Error in PATCH /api/obras/[id]/inspecciones/[inspeccionId]:",
      error
    );
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; inspeccionId: string } }
) {
  return eliminarInspeccion(params.inspeccionId);
}
