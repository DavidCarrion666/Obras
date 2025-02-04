import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Inspeccion from "@/models/Inspeccion";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(
  request: Request,
  {
    params,
  }: { params: { id: string; inspeccionId: string; problemaId: string } }
) {
  try {
    await dbConnect();
    const { id, inspeccionId, problemaId } = params;

    const formData = await request.formData();
    const descripcion = formData.get("descripcion") as string;
    const responsable = formData.get("responsable") as string;
    const fechaImplementacion = formData.get("fechaImplementacion") as string;
    const evidencias = formData.getAll("evidencias") as File[];

    const inspeccion = await Inspeccion.findOne({
      _id: inspeccionId,
      obraId: id,
    });
    if (!inspeccion) {
      return NextResponse.json(
        { error: "Inspección no encontrada" },
        { status: 404 }
      );
    }

    const problema = inspeccion.problemas.id(problemaId);
    if (!problema) {
      return NextResponse.json(
        { error: "Problema no encontrado" },
        { status: 404 }
      );
    }

    const evidenciasUrls = await Promise.all(
      evidencias.map(async (file: File) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(
          process.cwd(),
          "public",
          "uploads",
          fileName
        );
        await writeFile(filePath, buffer);
        return `/uploads/${fileName}`;
      })
    );

    problema.solucion = {
      descripcion,
      responsable,
      fechaImplementacion: new Date(fechaImplementacion),
      evidencias: evidenciasUrls,
    };

    await inspeccion.save();

    return NextResponse.json(
      { message: "Solución registrada correctamente" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar la solución:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
