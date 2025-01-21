import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientDto } from './dto/patient.dto';


@Injectable()
export class PatientService {
  constructor(@InjectModel('Patient') private readonly patientModel: Model<Patient>) {}

  /**
   * Get the next patient ID by finding the highest current ID and incrementing it by 1.
   * @returns The next unique patient ID.
   */
  private async getNextPatientId(): Promise<number> {
    const lastPatient = await this.patientModel
      .findOne({})
      .sort({ id: -1 })
      .select('id')
      .exec();

    return lastPatient ? lastPatient.id + 1 : 1; // Start at 1 if no patients exist
  }


  /**
   * Create a new patient.
   * @param patientData - Patient data (excluding id).
   * @returns The created patient object.
   */
  async createPatient(patientData: CreatePatientDto): Promise<PatientDto> {
    const id = await this.getNextPatientId();
    const patient = new this.patientModel({ ...patientData, id });
    const savedPatient = await patient.save();

    return savedPatient
  }

  /**
   * Get all patients.
   * @returns An array of all patient records.
   */
  async getAllPatients(): Promise<PatientDto[]> {
    const patients = await this.patientModel.find().exec();
    return patients;
  }

  /**
   * Get a patient by ID.
   * @param id - The patient ID.
   * @returns The patient object, or null if not found.
   */
  async getPatientById(id: number): Promise<PatientDto> {
    const patient = await this.patientModel.findOne({id }).exec();

    if (!patient) {
        throw new NotFoundException(`Patient with ID ${id} not found.`);
      }

    return patient;
  }
}
