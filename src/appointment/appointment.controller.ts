import { Controller, Get, Post, Param, Query, HttpException, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { FileInterceptor } from '@nestjs/platform-express';


ApiTags('Appointments')
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @ApiOkResponse({ type: Promise, isArray: true })
  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({ status: 200, description: 'Returns a list of all appointments' }) 
  @ApiQuery({ name: 'patient_id', required: false, description: 'Filter by patient ID' })
  @ApiQuery({ name: 'doctor', required: false, description: 'Filter by doctor name' })
  async findAll(
    @Query('patient_id') patient_id?: number,
    @Query('doctor') doctor?: string
): Promise<any> {
    // Construct query object
    const filters: any = {};
    if (patient_id) {
        filters.patient_id = parseInt(patient_id as unknown as string, 10);
    }
    if (doctor) {
        filters.doctor = doctor;
    }
    return this.appointmentService.getAllAppointments(filters);
  }

  @ApiOkResponse({ type: Promise })
  @Get(':id')
  @ApiOperation({ summary: 'Get an appointment by ID' })
  @ApiResponse({ status: 200, description: 'Returns the appointment with the given ID' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async findOne(@Param('id') id: string): Promise<any> {
    const appointment = await this.appointmentService.getAppointmentById(parseInt(id, 10));
    if (!appointment) throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
    return appointment;
  }

  @ApiCreatedResponse({ type: String })
  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
        dest: './s3/appointment-uploads'
    })
  )
  @ApiOperation({ summary: 'Process a CSV file of appointments' })
  @ApiResponse({ status: 200, description: 'CSV processing event received' })
  @ApiResponse({ status: 400, description: 'Invalid file path or error in processing' })
  async uploadCSV(@UploadedFile() file): Promise<{ message: string }> {

    // Publish the event to RabbitMQ
    this.appointmentService.processCSVFile(file.path);

    // Immediately return a response indicating the request was received
    return { message: 'CSV processing event received. Processing will happen asynchronously.' };
  }  
}
