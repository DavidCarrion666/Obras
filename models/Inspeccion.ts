import mongoose, { Schema, Document } from "mongoose";

export interface IProblema {
  descripcion: string;
  evidencias: string[]; // Array of file URLs
  reportesSecundarios: string[]; // Array of file URLs for secondary reports
}

export interface IInspeccion extends Document {
  obraId: mongoose.Types.ObjectId;
  actividadId: mongoose.Types.ObjectId;
  fecha: Date;
  observaciones: string;
  problemas: IProblema[];
  estado: "Pendiente" | "En Proceso" | "Completada";
}

const ProblemaSchema: Schema = new Schema({
  descripcion: { type: String, required: true },
  evidencias: [{ type: String }],
  reportesSecundarios: [{ type: String }],
});

const InspeccionSchema: Schema = new Schema({
  obraId: { type: Schema.Types.ObjectId, ref: "Obra", required: true },
  actividadId: {
    type: Schema.Types.ObjectId,
    ref: "Actividad",
    required: true,
  },
  fecha: { type: Date, required: true },
  observaciones: { type: String, required: true },
  problemas: [ProblemaSchema],
  estado: {
    type: String,
    enum: ["Pendiente", "En Proceso", "Completada"],
    default: "Pendiente",
  },
});

export default mongoose.models.Inspeccion ||
  mongoose.model<IInspeccion>("Inspeccion", InspeccionSchema);
