import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Obra from "@/models/Obra";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const obra = new Obra(body);
    await obra.save();
    return NextResponse.json(obra, { status: 201 });
  } catch (error) {
    console.error("Error creating obra:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const obras = await Obra.find({});
    return NextResponse.json(obras);
  } catch (error) {
    console.error("Error fetching obras:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
