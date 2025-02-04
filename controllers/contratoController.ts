import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Contrato, { type IContrato } from "@/models/Contrato";
import Obra from "@/models/Obra";

export async function crearContrato(obraId: string, data: Partial<IContrato>) {
  try {
    await dbConnect();
    const obra = await Obra.findById(obraId);
    if (!obra) {
      return NextResponse.json(
        { error: "Obra no encontrada" },
        { status: 404 }
      );
    }

    const nuevoContrato = new Contrato({
      ...data,
      obraId,
    });
    await nuevoContrato.save();

    return NextResponse.json(nuevoContrato, { status: 201 });
  } catch (error) {
    console.error("Error al crear el contrato:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function obtenerContratos(obraId: string) {
  try {
    await dbConnect();
    const contratos = await Contrato.find({ obraId });
    return NextResponse.json(contratos);
  } catch (error) {
    console.error("Error al obtener los contratos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function obtenerContrato(id: string) {
  try {
    await dbConnect();
    const contrato = await Contrato.findById(id);
    if (!contrato) {
      return NextResponse.json(
        { error: "Contrato no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(contrato);
  } catch (error) {
    console.error("Error al obtener el contrato:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function actualizarContrato(id: string, data: Partial<IContrato>) {
  try {
    await dbConnect();
    const contratoActualizado = await Contrato.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!contratoActualizado) {
      return NextResponse.json(
        { error: "Contrato no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(contratoActualizado);
  } catch (error) {
    console.error("Error al actualizar el contrato:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function eliminarContrato(id: string) {
  try {
    await dbConnect();
    const contratoEliminado = await Contrato.findByIdAndDelete(id);
    if (!contratoEliminado) {
      return NextResponse.json(
        { error: "Contrato no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Contrato eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el contrato:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
