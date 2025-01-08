import mongoose, { Schema, Document } from "mongoose";

export interface IUbicacion {
  nombre: string;
  latitud: number;
  longitud: number;
  fechaRegistro: Date;
}

export interface IActividadAsignada {
  actividad: mongoose.Types.ObjectId;
  observacion: string;
  completada: boolean;
}

export interface IObra extends Document {
  nombreObra: string;
  capacidadInfraestructura: string;
  categoria: string;
  descripcionObra: string;
  estadoObra: string;
  tipoIntervencion:
    | "Construcción"
    | "Adecentamiento"
    | "Repotenciación"
    | "Reconstrucción"
    | "Rehabilitación"
    | "Reapertura";
  cup: string;
  ubicaciones: IUbicacion[];
  fecha_inicio: Date;
  fecha_fin?: Date;
  presupuesto: number;
  actividades: IActividadAsignada[];
  devengadoTotal: number;
  porcentajeAvance: number;
}

const UbicacionSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  latitud: { type: Number, required: true },
  longitud: { type: Number, required: true },
  fechaRegistro: { type: Date, default: Date.now },
});

const ActividadAsignadaSchema: Schema = new Schema({
  actividad: { type: Schema.Types.ObjectId, ref: "Actividad", required: true },
  observacion: { type: String, default: "" },
  completada: { type: Boolean, default: false },
});

const ObraSchema: Schema = new Schema({
  nombreObra: { type: String, required: true },
  capacidadInfraestructura: { type: String, required: true },
  categoria: {
    type: String,
    required: true,
    enum: [
      "Agua y Saneamiento",
      "Centros de Desarrollo Infantil",
      "Centros de Salud",
      "Estratégicos",
      "Generación eléctrica",
      "Hospitales",
      "Infraestructura Cultural",
      "Infraestructura Deportiva",
      "Infraestructura Productiva",
      "Infraestructura Turística",
      "Infraestructura Urbana",
      "Institutos Multipropósito",
      "Otros",
      "Parques",
      "Puestos de Salud",
      "Reasentamientos",
      "Seguridad",
      "Unidades Educativas",
      "Universidades",
      "Vialidad",
      "Vivienda",
    ],
  },
  descripcionObra: { type: String, required: true },
  estadoObra: { type: String, required: true },
  tipoIntervencion: {
    type: String,
    required: true,
    enum: [
      "Construcción",
      "Adecentamiento",
      "Repotenciación",
      "Reconstrucción",
      "Rehabilitación",
      "Reapertura",
    ],
  },
  cup: { type: String, required: true },
  ubicaciones: [UbicacionSchema],
  fecha_inicio: { type: Date, required: true },
  fecha_fin: { type: Date },
  presupuesto: { type: Number, required: true },
  actividades: [ActividadAsignadaSchema],
  devengadoTotal: { type: Number, default: 0 },
  porcentajeAvance: { type: Number, default: 0 },
});

export default mongoose.models.Obra ||
  mongoose.model<IObra>("Obra", ObraSchema);
