import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Inversion from "@/models/Inversion";

export async function GET(
  request: Request,
  { params }: { params: { categoria: string } }
) {
  await dbConnect();
  const { categoria } = params;

  try {
    const inversion = await Inversion.findOne({ categoria });
    if (!inversion) {
      console.log(`No se encontró inversión para la categoría: ${categoria}`);
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }
    console.log(`Inversión encontrada para ${categoria}:`, inversion);
    return NextResponse.json(inversion);
  } catch (error) {
    console.error("Error fetching inversion:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
