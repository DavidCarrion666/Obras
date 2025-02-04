import mongoose, { Schema, type Document } from "mongoose";

export interface ISolucion {
  descripcion: string;
  fechaImplementacion: Date;
  responsable: string;
  documentos: string[]; // Array of file URLs
}

export interface IProblema extends Document {
  descripcion: string;
  evidencias: string[]; // Array of file URLs
  reportesSecundarios: string[]; // Array of file URLs for secondary reports
  solucion?: ISolucion;
  estado: "Pendiente" | "En Proceso" | "Resuelto";
}

export interface IInspeccion extends Document {
  obraId: mongoose.Types.ObjectId;
  actividadId: mongoose.Types.ObjectId;
  fecha: Date;
  observaciones: string;
  problemas: IProblema[];
  estado: "Pendiente" | "En Proceso" | "Completada";
}

const SolucionSchema: Schema = new Schema({
  descripcion: { type: String, required: true },
  fechaImplementacion: { type: Date, required: true },
  responsable: { type: String, required: true },
  documentos: [{ type: String }],
});

const ProblemaSchema: Schema = new Schema({
  descripcion: { type: String, required: true },
  evidencias: [{ type: String }],
  reportesSecundarios: [{ type: String }],
  solucion: SolucionSchema,
  estado: {
    type: String,
    enum: ["Pendiente", "En Proceso", "Resuelto"],
    default: "Pendiente",
  },
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
