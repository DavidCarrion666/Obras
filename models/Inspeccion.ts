import mongoose, { Schema, Document } from "mongoose";

export interface IInspeccion extends Document {
  obraId: mongoose.Types.ObjectId;
  fecha: Date;
  observaciones: string;
  evidenciaUrl: string;
}

const InspeccionSchema: Schema = new Schema({
  obraId: { type: Schema.Types.ObjectId, ref: "Obra", required: true },
  fecha: { type: Date, required: true },
  observaciones: { type: String, required: true },
  evidenciaUrl: { type: String },
});

export default mongoose.model<IInspeccion>("Inspeccion", InspeccionSchema);
