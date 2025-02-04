import type { NextRequest } from "next/server";
import {
  crearContrato,
  obtenerContratos,
} from "@/controllers/contratoController";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  return crearContrato(params.id, data);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return obtenerContratos(params.id);
}
