import { ApiProperty } from '@nestjs/swagger';

export class PatientDto {
  @ApiProperty({ description: 'The unique ID of the patient', example: 1 })
  id: number;

  @ApiProperty({ description: 'The name of the patient', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'The age of the patient', example: 30 })
  age: number;

  @ApiProperty({ description: 'The gender of the patient', example: 'Male' })
  gender: string;

  @ApiProperty({ description: 'The contact information of the patient', example: '555-1234' })
  contact: string;
}
