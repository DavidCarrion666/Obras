import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Obra from "@/models/Obra";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const obra = await Obra.findById(id);
    if (!obra) {
      return NextResponse.json(
        { error: "Obra no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json(obra);
  } catch (error) {
    console.error("Error fetching obra:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();

    // Remove undefined fields
    Object.keys(body).forEach(
      (key) => body[key] === undefined && delete body[key]
    );

    const updatedObra = await Obra.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });

    if (!updatedObra) {
      return NextResponse.json(
        { error: "Obra no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedObra);
  } catch (error) {
    console.error("Error updating obra:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return PATCH(request, { params });
}
