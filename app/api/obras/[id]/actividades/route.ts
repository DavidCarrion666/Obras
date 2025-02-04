import type { NextRequest } from "next/server";
import {
  agregarActividadAObra,
  obtenerActividadesDeObra,
} from "@/controllers/actividadController";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { actividadId } = await request.json();
  return agregarActividadAObra(params.id, actividadId);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return obtenerActividadesDeObra(params.id);
}
