import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class AppointmentDto {
  @ApiProperty({ description: 'Unique ID of the appointment' })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: 'ID of the patient' })
  @IsInt()
  @IsNotEmpty()
  patient_id: number;

  @ApiProperty({ description: 'Name of the doctor' })
  @IsString()
  @IsNotEmpty()
  doctor: string;

  @ApiProperty({ description: 'Appointment date in ISO 8601 format', example: '2025-01-20T10:00:00Z' })
  @IsISO8601()
  @IsNotEmpty()
  appointment_date: string;

  @ApiProperty({ description: 'Reason for the appointment' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
