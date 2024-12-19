import mongoose, { Schema, Document } from "mongoose";

export interface IContrato extends Document {
  obraId: mongoose.Types.ObjectId;
  tipo: string;
  detalles: string;
  fechaFirma: Date;
  pdfUrl: string;
}

const ContratoSchema: Schema = new Schema({
  obraId: { type: Schema.Types.ObjectId, ref: "Obra", required: true },
  tipo: { type: String, required: true },
  detalles: { type: String, required: true },
  fechaFirma: { type: Date, required: true },
  pdfUrl: { type: String, required: true },
});

export default mongoose.model<IContrato>("Contrato", ContratoSchema);
