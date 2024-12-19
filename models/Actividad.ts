import mongoose, { Schema, Document } from "mongoose";

export interface IActividad extends Document {
  obraId: mongoose.Types.ObjectId;
  nombre: string;
  fechaInicio: Date;
  fechaFin: Date;
  observacion: string;
  completada: boolean;
}

const ActividadSchema: Schema = new Schema({
  obraId: { type: Schema.Types.ObjectId, ref: "Obra", required: true },
  nombre: { type: String, required: true },
  fechaInicio: { type: Date, required: true },
  fechaFin: { type: Date, required: true },
  observacion: { type: String },
  completada: { type: Boolean, default: false },
});

export default mongoose.model<IActividad>("Actividad", ActividadSchema);
