import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Obra from "@/models/Obra";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; actividadId: string } }
) {
  try {
    await dbConnect();
    const { id, actividadId } = params;
    const updateData = await request.json();

    const obra = await Obra.findById(id);
    if (!obra) {
      return NextResponse.json(
        { error: "Obra no encontrada" },
        { status: 404 }
      );
    }

    const actividadIndex = obra.actividades.findIndex(
      (a) => a._id.toString() === actividadId
    );
    if (actividadIndex === -1) {
      return NextResponse.json(
        { error: "Actividad no encontrada en esta obra" },
        { status: 404 }
      );
    }

    // Actualizar solo los campos permitidos
    if ("observacion" in updateData) {
      obra.actividades[actividadIndex].observacion = updateData.observacion;
    }
    if ("completada" in updateData) {
      obra.actividades[actividadIndex].completada = updateData.completada;
    }

    await obra.save();

    return NextResponse.json(obra.actividades[actividadIndex]);
  } catch (error) {
    console.error("Error updating actividad:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
