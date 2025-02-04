import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Actividad, { type IActividad } from "@/models/Actividad";
import Obra from "@/models/Obra";

export async function crearActividad(data: Partial<IActividad>) {
  try {
    await dbConnect();
    const nuevaActividad = new Actividad(data);
    await nuevaActividad.save();
    return NextResponse.json(nuevaActividad, { status: 201 });
  } catch (error) {
    console.error("Error al crear la actividad:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function obtenerActividades() {
  try {
    await dbConnect();
    const actividades = await Actividad.find({});
    return NextResponse.json(actividades);
  } catch (error) {
    console.error("Error al obtener las actividades:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function obtenerActividad(id: string) {
  try {
    await dbConnect();
    const actividad = await Actividad.findById(id);
    if (!actividad) {
      return NextResponse.json(
        { error: "Actividad no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json(actividad);
  } catch (error) {
    console.error("Error al obtener la actividad:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function actualizarActividad(
  id: string,
  data: Partial<IActividad>
) {
  try {
    await dbConnect();
    const actividadActualizada = await Actividad.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!actividadActualizada) {
      return NextResponse.json(
        { error: "Actividad no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json(actividadActualizada);
  } catch (error) {
    console.error("Error al actualizar la actividad:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function eliminarActividad(id: string) {
  try {
    await dbConnect();
    const actividadEliminada = await Actividad.findByIdAndDelete(id);
    if (!actividadEliminada) {
      return NextResponse.json(
        { error: "Actividad no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Actividad eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la actividad:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function agregarActividadAObra(
  obraId: string,
  actividadId: string
) {
  try {
    await dbConnect();
    const obra = await Obra.findById(obraId);
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

    // Verificar si la actividad ya está asignada a la obra
    const actividadExistente = obra.actividades.find(
      (a) => a.actividad.toString() === actividadId
    );
    if (actividadExistente) {
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

    return NextResponse.json({
      message: "Actividad agregada a la obra correctamente",
    });
  } catch (error) {
    console.error("Error al agregar la actividad a la obra:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function obtenerActividadesDeObra(obraId: string) {
  try {
    await dbConnect();
    const obra = await Obra.findById(obraId).populate("actividades.actividad");
    if (!obra) {
      return NextResponse.json(
        { error: "Obra no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json(obra.actividades);
  } catch (error) {
    console.error("Error al obtener las actividades de la obra:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
