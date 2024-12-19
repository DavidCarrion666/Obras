import mongoose, { Schema, Document } from "mongoose";

export interface IIncidencia extends Document {
  inspeccionId: mongoose.Types.ObjectId;
  descripcion: string;
  fecha: Date;
  estado: string;
  observaciones: string;
  documentos: string[];
}

const IncidenciaSchema: Schema = new Schema({
  inspeccionId: {
    type: Schema.Types.ObjectId,
    ref: "Inspeccion",
    required: true,
  },
  descripcion: { type: String, required: true },
  fecha: { type: Date, required: true },
  estado: { type: String, required: true },
  observaciones: { type: String },
  documentos: [{ type: String }],
});

export default mongoose.model<IIncidencia>("Incidencia", IncidenciaSchema);
