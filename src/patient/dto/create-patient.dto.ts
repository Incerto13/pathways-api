import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({ description: 'The patient\'s full name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The patient\'s age', minimum: 0 })
  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty({ description: 'The patient\'s gender' })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ description: 'The patient\'s contact information' })
  @IsString()
  @IsNotEmpty()
  contact: string;
}
