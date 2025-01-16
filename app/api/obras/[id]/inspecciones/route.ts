import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Inspeccion from "@/models/Inspeccion";
import Actividad from "@/models/Actividad";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const inspecciones = await Inspeccion.find({ obraId: id })
      .populate({
        path: "actividadId",
        model: Actividad,
        select: "nombre descripcion fechaInicio fechaFin",
      })
      .lean();

    // Transform the data to ensure actividadId is an object with a nombre property
    const transformedInspecciones = inspecciones.map((inspeccion) => ({
      ...inspeccion,
      actividadId: inspeccion.actividadId
        ? {
            ...inspeccion.actividadId,
            nombre: inspeccion.actividadId.nombre || "Sin nombre",
          }
        : null,
    }));

    return NextResponse.json(transformedInspecciones);
  } catch (error) {
    console.error("Error fetching inspecciones:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
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

    const formData = await request.formData();
    const actividadId = formData.get("actividadId") as string;
    const observaciones = formData.get("observaciones") as string;
    const problemas = JSON.parse(formData.get("problemas") as string);

    const inspeccion = new Inspeccion({
      obraId: id,
      actividadId,
      fecha: new Date(),
      observaciones,
      problemas: await Promise.all(
        problemas.map(async (problema: any) => {
          const evidencias = await Promise.all(
            problema.evidencias.map(async (file: File) => {
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

          const reportesSecundarios = await Promise.all(
            problema.reportesSecundarios.map(async (file: File) => {
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

          return {
            descripcion: problema.descripcion,
            evidencias,
            reportesSecundarios,
          };
        })
      ),
    });

    await inspeccion.save();
    return NextResponse.json(inspeccion, { status: 201 });
  } catch (error) {
    console.error("Error creating inspeccion:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
