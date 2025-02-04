import { type NextRequest, NextResponse } from "next/server";
import {
  crearInspeccion,
  obtenerInspecciones,
} from "@/controllers/inspeccionController";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const dataString = formData.get("data") as string;
    console.log("Received data string:", dataString);

    let data;
    try {
      data = JSON.parse(dataString);
    } catch (parseError) {
      console.error("Error parsing JSON data:", parseError);
      return NextResponse.json({ error: "Invalid JSON data" }, { status: 400 });
    }

    console.log("Parsed data:", data);

    const files: { [key: string]: File[] } = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (!files[key]) {
          files[key] = [];
        }
        files[key].push(value);
      }
    }

    console.log("Files received:", Object.keys(files));

    const result = await crearInspeccion(params.id, data, files);
    console.log("Inspection creation result:", result);
    return result;
  } catch (error) {
    console.error("Error in POST /api/obras/[id]/inspecciones:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    return await obtenerInspecciones(params.id);
  } catch (error) {
    console.error("Error in GET /api/obras/[id]/inspecciones:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}
