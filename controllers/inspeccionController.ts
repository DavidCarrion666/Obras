import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Inspeccion, {
  type IInspeccion,
  type IProblema,
} from "@/models/Inspeccion";
import Obra from "@/models/Obra";
import Actividad from "@/models/Actividad";
import { writeFile } from "fs/promises";
import path from "path";

export async function crearInspeccion(
  obraId: string,
  data: Partial<IInspeccion>,
  files: { [key: string]: File[] }
) {
  console.log("Creating inspection for obra:", obraId);
  console.log("Inspection data:", data);
  console.log("Files received:", Object.keys(files));

  try {
    await dbConnect();
    console.log("Database connected");

    const obra = await Obra.findById(obraId);
    if (!obra) {
      console.error(`Obra not found with ID: ${obraId}`);
      return NextResponse.json(
        { error: "Obra no encontrada" },
        { status: 404 }
      );
    }
    console.log("Obra found:", obra._id);

    const actividad = await Actividad.findById(data.actividadId);
    if (!actividad) {
      console.error(`Actividad not found with ID: ${data.actividadId}`);
      return NextResponse.json(
        { error: "Actividad no encontrada" },
        { status: 404 }
      );
    }
    console.log("Actividad found:", actividad._id);

    const problemas = await Promise.all(
      (data.problemas || []).map(
        async (problema: Partial<IProblema>, index: number) => {
          console.log(`Processing problema ${index}:`, problema);
          const evidencias = await guardarArchivos(
            files[`problema${index}_evidencia`] || []
          );
          const reportesSecundarios = await guardarArchivos(
            files[`problema${index}_reporte`] || []
          );
          return {
            ...problema,
            evidencias,
            reportesSecundarios,
          };
        }
      )
    );
    console.log("Processed problemas:", problemas);

    const nuevaInspeccion = new Inspeccion({
      ...data,
      obraId,
      problemas,
    });

    console.log("New inspection object:", nuevaInspeccion);

    await nuevaInspeccion.save();
    console.log(`New inspection created with ID: ${nuevaInspeccion._id}`);

    return NextResponse.json(nuevaInspeccion, { status: 201 });
  } catch (error) {
    console.error("Detailed error when creating inspection:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}

export async function obtenerInspecciones(obraId: string) {
  try {
    await dbConnect();
    const inspecciones = await Inspeccion.find({ obraId }).populate(
      "actividadId",
      "nombre"
    );
    console.log(
      `Retrieved ${inspecciones.length} inspections for obra ${obraId}`
    );
    return NextResponse.json(inspecciones);
  } catch (error) {
    console.error(
      `Detailed error when retrieving inspections for obra ${obraId}:`,
      error
    );
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}

export async function obtenerInspeccion(id: string) {
  try {
    await dbConnect();
    const inspeccion = await Inspeccion.findById(id).populate(
      "actividadId",
      "nombre"
    );
    if (!inspeccion) {
      return NextResponse.json(
        { error: "Inspección no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json(inspeccion);
  } catch (error) {
    console.error("Error al obtener la inspección:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}

export async function actualizarInspeccion(
  id: string,
  data: Partial<IInspeccion>
) {
  try {
    await dbConnect();
    console.log("Updating inspection with ID:", id);
    console.log("Update data:", data);

    const inspeccion = await Inspeccion.findById(id);
    if (!inspeccion) {
      console.log("Inspection not found");
      return NextResponse.json(
        { error: "Inspección no encontrada" },
        { status: 404 }
      );
    }

    // Update only the fields that are present in the data object
    Object.keys(data).forEach((key) => {
      if (key in inspeccion) {
        inspeccion[key] = data[key];
      }
    });

    const updatedInspeccion = await inspeccion.save();
    console.log("Inspection updated successfully");
    return NextResponse.json(updatedInspeccion);
  } catch (error) {
    console.error("Error al actualizar la inspección:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}

export async function eliminarInspeccion(id: string) {
  try {
    await dbConnect();
    const inspeccionEliminada = await Inspeccion.findByIdAndDelete(id);
    if (!inspeccionEliminada) {
      return NextResponse.json(
        { error: "Inspección no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Inspección eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la inspección:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}

async function guardarArchivos(files: File[]): Promise<string[]> {
  console.log(`Saving ${files.length} files`);
  const uploadPromises = files.map(async (file, index) => {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);
      await writeFile(filePath, buffer);
      console.log(`File saved: ${filePath}`);
      return `/uploads/${fileName}`;
    } catch (error) {
      console.error(`Error saving file ${file.name}:`, error);
      throw error;
    }
  });

  return Promise.all(uploadPromises);
}
