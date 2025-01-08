import mongoose, { Schema, Document } from "mongoose";

export interface IInversion extends Document {
  categoria: string;
  inversion: number;
}

const InversionSchema: Schema = new Schema({
  categoria: { type: String, required: true, unique: true },
  inversion: { type: Number, required: true },
});

export default mongoose.models.Inversion ||
  mongoose.model<IInversion>("Inversion", InversionSchema);
