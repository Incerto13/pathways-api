import { Schema, Document } from 'mongoose';

export interface Appointment extends Document {
  id: number;
  patient_id: number;
  doctor: string;
  appointment_date: string;
  reason: string;
}

export const AppointmentSchema = new Schema<Appointment>({
  id: { type: Number, unique: true, required: true },
  patient_id: { type: Number, required: true },
  doctor: { type: String, required: true },
  appointment_date: { type: String, required: true },
  reason: { type: String, required: true },
});
