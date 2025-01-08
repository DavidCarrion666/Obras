import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Actividad from "@/models/Actividad";

export async function GET() {
  try {
    await dbConnect();
    const actividades = await Actividad.find({});
    return NextResponse.json(actividades);
  } catch (error) {
    console.error("Error fetching actividades:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}
