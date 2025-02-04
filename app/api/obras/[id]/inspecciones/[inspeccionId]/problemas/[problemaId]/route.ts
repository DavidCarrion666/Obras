import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Inspeccion from "@/models/Inspeccion";
import { writeFile } from "fs/promises";
import path from "path";

export async function PATCH(
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
    const estado = formData.get("estado") as
      | "Pendiente"
      | "En Proceso"
      | "Resuelto";
    const solucionDescripcion = formData.get("solucion[descripcion]") as string;
    const solucionResponsable = formData.get("solucion[responsable]") as string;
    const solucionFechaImplementacion = formData.get(
      "solucion[fechaImplementacion]"
    ) as string;
    const solucionDocumentos = formData.getAll(
      "solucion[documentos]"
    ) as File[];

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

    problema.descripcion = descripcion;
    problema.estado = estado;

    if (solucionDescripcion) {
      const documentosUrls = await Promise.all(
        solucionDocumentos.map(async (file: File) => {
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
        descripcion: solucionDescripcion,
        responsable: solucionResponsable,
        fechaImplementacion: new Date(solucionFechaImplementacion),
        documentos: documentosUrls,
      };
    }

    await inspeccion.save();

    return NextResponse.json(problema);
  } catch (error) {
    console.error("Error updating problema:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  {
    params,
  }: { params: { id: string; inspeccionId: string; problemaId: string } }
) {
  try {
    await dbConnect();
    const { id, inspeccionId, problemaId } = params;

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

    inspeccion.problemas = inspeccion.problemas.filter(
      (problema) => problema._id.toString() !== problemaId
    );

    await inspeccion.save();

    return NextResponse.json({ message: "Problema eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting problema:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
