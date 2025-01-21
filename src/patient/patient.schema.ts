import { Schema, Document } from 'mongoose';

export interface Patient extends Document {
  id: number;
  name: string;
  age: number;
  gender: string;
  contact: string;
}

export const PatientSchema = new Schema<Patient>({
  id: { type: Number, unique: true, sparse: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  contact: { type: String, required: true },
});
