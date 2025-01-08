import mongoose, { Schema, Document } from "mongoose";

export interface IActividad extends Document {
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
}

const ActividadSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  fechaInicio: { type: Date, required: true },
  fechaFin: { type: Date, required: true },
});

export default mongoose.models.Actividad ||
  mongoose.model<IActividad>("Actividad", ActividadSchema);
