import mongoose, { Schema, Document } from "mongoose";

export interface IObra extends Document {
  nombreObra: string;
  capacidadInfraestructura: string;
  categoria: string;
  descripcionObra: string;
  estadoObra: string;
  tipoIntervencion: string;
  ubicacion: string;
  fecha_inicio: Date;
}

const ObraSchema: Schema = new Schema({
  nombreObra: { type: String, required: true },
  capacidadInfraestructura: { type: String, required: true },
  categoria: { type: String, required: true },
  descripcionObra: { type: String, required: true },
  estadoObra: { type: String, required: true },
  tipoIntervencion: { type: String, required: true },
  ubicacion: { type: String, required: true },
  fecha_inicio: { type: Date, required: true },
});

export default mongoose.models.Obra ||
  mongoose.model<IObra>("Obra", ObraSchema);
