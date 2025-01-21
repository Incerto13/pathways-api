import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from './appointment.schema';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { sendCSVProcessingEvent } from './event-producer';
import { AppointmentDto } from './dto/appointment.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';


@Injectable()
export class AppointmentService {
  private appointmentIdCounter = 1;

  constructor(@InjectModel('Appointment') private readonly appointmentModel: Model<Appointment>) {}

/**
 * Get the next appointment ID(s) by finding the highest current ID and generating subsequent IDs.
 * @param n - The number of IDs to generate (default is 1).
 * @returns The next unique appointment ID or an array of IDs if `n > 1`.
 * TODO: combine into singular standalone service w/ patient-counter
 */
 private async getNextAppointmentId(n: number = 1): Promise<number | number[]> {
 const lastAppointment = await this.appointmentModel
  .findOne({})
  .sort({ id: -1 })
  .select('id')
  .exec();

  const startId = lastAppointment ? lastAppointment.id + 1 : 1;

  // Generate a single ID or an array of IDs
  if (n === 1) {
    return startId;
  }

  return Array.from({ length: n }, (_, i) => startId + i);
  } 


  /**
   * Get all appointments with optional filters.
   * @param filters - Query parameters for filtering by patient_id and doctor.
   * @returns An array of appointments.
   */
  async getAllAppointments(filters: { patient_id?: number; doctor?: string }): Promise<AppointmentDto[]> {
    const query: any = {};
    if (filters.patient_id) {
      query.patient_id = filters.patient_id;
    }
    if (filters.doctor) {
      query.doctor = filters.doctor;
    }
    return this.appointmentModel.find(query).exec();
  }

  /**
   * Get an appointment by ID.
   * @param id - The appointment ID.
   * @returns The appointment object, or null if not found.
   */
  async getAppointmentById(id: number): Promise<Appointment | null> {
    const appointment = this.appointmentModel.findOne({ id }).exec();

    if (!appointment) {
        throw new NotFoundException(`Patient with ID ${id} not found.`);
    }

    return appointment;
  }

  /**
   * Process a CSV file by publishing it to the event queue.
   * @param filepath - Path to the CSV file.
   */
  async processCSVFile(filepath: string): Promise<void> {
    if (!fs.existsSync(filepath)) {
      throw new Error('CSV file does not exist.');
    }
    await sendCSVProcessingEvent(filepath);
  }

  /**
   * Save appointments to the database.
   * This method is used by the RabbitMQ consumer.
   * @param appointments - Array of appointment objects to save.
   */
  async saveAppointments(appointments: Partial<CreateAppointmentDto>[]): Promise<void> {
    const ids = await this.getNextAppointmentId(appointments.length);

    const appointmentsToSave = await Promise.all(
        appointments.map(async (appointment, index) => ({
          id: Array.isArray(ids) ? ids[index] : ids, // map id from array or just assign single
          ...appointment,
        }))
        );

      await this.appointmentModel.insertMany(appointmentsToSave);
  }
}
