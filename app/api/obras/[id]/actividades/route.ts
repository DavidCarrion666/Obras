import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Obra from "@/models/Obra";
import Actividad from "@/models/Actividad";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const obra = await Obra.findById(id).populate("actividades.actividad");
    if (!obra) {
      return NextResponse.json(
        { error: "Obra no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json(obra.actividades);
  } catch (error) {
    console.error("Error fetching actividades:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const { actividadId } = await request.json();

    const obra = await Obra.findById(id);
    if (!obra) {
      return NextResponse.json(
        { error: "Obra no encontrada" },
        { status: 404 }
      );
    }

    const actividad = await Actividad.findById(actividadId);
    if (!actividad) {
      return NextResponse.json(
        { error: "Actividad no encontrada" },
        { status: 404 }
      );
    }

    // Check if the activity is already assigned to the obra
    const existingActividad = obra.actividades.find(
      (a) => a.actividad.toString() === actividadId
    );
    if (existingActividad) {
      return NextResponse.json(
        { error: "La actividad ya está asignada a esta obra" },
        { status: 400 }
      );
    }

    obra.actividades.push({
      actividad: actividadId,
      observacion: "",
      completada: false,
    });
    await obra.save();

    const updatedObra = await Obra.findById(id).populate(
      "actividades.actividad"
    );
    const newActividad =
      updatedObra.actividades[updatedObra.actividades.length - 1];

    return NextResponse.json({
      message: "Actividad asignada correctamente",
      actividad: newActividad,
    });
  } catch (error) {
    console.error("Error adding actividad:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}
