import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Contrato from "@/models/Contrato";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();

    const newContrato = new Contrato({
      ...body,
      obraId: id,
    });

    await newContrato.save();
    return NextResponse.json(newContrato, { status: 201 });
  } catch (error) {
    console.error("Error creating contrato:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const contratos = await Contrato.find({ obraId: id });
    return NextResponse.json(contratos);
  } catch (error) {
    console.error("Error fetching contratos:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
