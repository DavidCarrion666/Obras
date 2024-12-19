import { NextResponse } from "next/server";
import dbConnect from "@/config/database";
import Obra from "@/models/Obra";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();
    const updatedObra = await Obra.findByIdAndUpdate(id, body, { new: true });
    if (!updatedObra) {
      return NextResponse.json(
        { error: "Obra no encontrada" },
        { status: 404 }
      );
    }
    // Aquí iría la lógica para enviar una notificación
    console.log(`Obra actualizada: ${updatedObra.nombreObra}`);
    return NextResponse.json(updatedObra);
  } catch (error) {
    console.error("Error updating obra:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
