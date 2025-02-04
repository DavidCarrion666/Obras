import mongoose, { Schema, type Document } from "mongoose";

export interface IContrato extends Document {
  obraId: mongoose.Types.ObjectId;
  tipoContrato: "Principal" | "Complementario" | "Otros";
  nombreContratista: string;
  monto: number;
  fechaContrato: Date;
  fechaFinContrato: Date;
  fuenteFinanciamiento:
    | "Recursos Fiscales"
    | "Crédito interno"
    | "Crédito externo"
    | "Asistencia Técnica y Donaciones"
    | "R. Fiscales / Otros";
  entidadFinanciamiento: string;
  avanceContrato: number;
}

const ContratoSchema: Schema = new Schema({
  obraId: { type: Schema.Types.ObjectId, ref: "Obra", required: true },
  tipoContrato: {
    type: String,
    required: true,
    enum: ["Principal", "Complementario", "Otros"],
  },
  nombreContratista: { type: String, required: true },
  monto: { type: Number, required: true },
  fechaContrato: { type: Date, required: true },
  fechaFinContrato: { type: Date, required: true },
  fuenteFinanciamiento: {
    type: String,
    required: true,
    enum: [
      "Recursos Fiscales",
      "Crédito interno",
      "Crédito externo",
      "Asistencia Técnica y Donaciones",
      "R. Fiscales / Otros",
    ],
  },
  entidadFinanciamiento: { type: String, required: true },
  avanceContrato: { type: Number, required: true, min: 0, max: 100 },
});

export default mongoose.models.Contrato ||
  mongoose.model<IContrato>("Contrato", ContratoSchema);
