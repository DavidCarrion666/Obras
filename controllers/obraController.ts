import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Obra, { type IObra } from "@/models/Obra";

export async function crearObra(data: Partial<IObra>) {
  try {
    await dbConnect();
    const nuevaObra = new Obra(data);
    await nuevaObra.save();
    return NextResponse.json(nuevaObra, { status: 201 });
  } catch (error) {
    console.error("Error al crear la obra:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function obtenerObras() {
  try {
    await dbConnect();
    const obras = await Obra.find({});
    return NextResponse.json(obras);
  } catch (error) {
    console.error("Error al obtener las obras:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function obtenerObra(id: string) {
  try {
    await dbConnect();
    const obra = await Obra.findById(id);
    if (!obra) {
      return NextResponse.json(
        { error: "Obra no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json(obra);
  } catch (error) {
    console.error("Error al obtener la obra:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function actualizarObra(id: string, data: Partial<IObra>) {
  try {
    await dbConnect();
    const obraActualizada = await Obra.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!obraActualizada) {
      return NextResponse.json(
        { error: "Obra no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json(obraActualizada);
  } catch (error) {
    console.error("Error al actualizar la obra:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function eliminarObra(id: string) {
  try {
    await dbConnect();
    const obraEliminada = await Obra.findByIdAndDelete(id);
    if (!obraEliminada) {
      return NextResponse.json(
        { error: "Obra no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Obra eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la obra:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
