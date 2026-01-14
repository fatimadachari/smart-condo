import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingResponseDto } from './dto/booking-response.dto';

@ApiTags('Reservas')
@ApiBearerAuth('JWT-auth')
@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post()
  @ApiOperation({ summary: 'Criar nova reserva' })
  @ApiResponse({ status: HttpStatus.CREATED, type: BookingResponseDto })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Horário indisponível para esta área.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datas inválidas.' })
  create(@Body() createBookingDto: CreateBookingDto): Promise<BookingResponseDto> {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as reservas' })
  @ApiResponse({ status: HttpStatus.OK, type: [BookingResponseDto] })
  findAll(): Promise<BookingResponseDto[]> {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar reserva por ID' })
  @ApiResponse({ status: HttpStatus.OK, type: BookingResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Reserva não encontrada.' })
  findOne(@Param('id') id: string): Promise<BookingResponseDto> {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar reserva' })
  @ApiResponse({ status: HttpStatus.OK, type: BookingResponseDto })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto): Promise<BookingResponseDto> {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir (cancelar) reserva' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  remove(@Param('id') id: string): Promise<void> {
    return this.bookingsService.remove(id);
  }
}