import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Obra from "@/models/Obra";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const { nombre, latitud, longitud } = await request.json();

    const obra = await Obra.findById(id);
    if (!obra) {
      return NextResponse.json(
        { error: "Obra no encontrada" },
        { status: 404 }
      );
    }

    obra.ubicaciones.push({ nombre, latitud, longitud });
    await obra.save();

    return NextResponse.json({
      message: "Ubicación añadida correctamente",
      ubicacion: obra.ubicaciones[obra.ubicaciones.length - 1],
    });
  } catch (error) {
    console.error("Error adding ubicacion:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    const obra = await Obra.findById(id);
    if (!obra) {
      return NextResponse.json(
        { error: "Obra no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(obra.ubicaciones);
  } catch (error) {
    console.error("Error fetching ubicaciones:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
