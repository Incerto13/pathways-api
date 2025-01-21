import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { PatientDto } from './dto/patient.dto';
import { CreatePatientDto } from './dto/create-patient.dto';

@ApiTags('Patients')
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @ApiCreatedResponse({ type: PatientDto })
  @Post()
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({ status: 201, description: 'Patient created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() patientData: CreatePatientDto): Promise<PatientDto> {
    return this.patientService.createPatient(patientData);
  }

  @ApiOkResponse({ type: PatientDto, isArray: true })
  @Get()
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({ status: 200, description: 'List of all patients' })
  async findAll(): Promise<PatientDto[]> {
    return this.patientService.getAllPatients();
  }

  @ApiOkResponse({ type: PatientDto })
  @Get(':id')
  @ApiOperation({ summary: 'Get a patient by ID' })
  @ApiResponse({ status: 200, description: 'Patient found' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async findOne(@Param('id') id: number): Promise<PatientDto> {
    const patient = await this.patientService.getPatientById(id);
    if (!patient) throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    return patient;
  }
}
