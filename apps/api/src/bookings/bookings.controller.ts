import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto, PrepayDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly service: BookingsService) {}
  @Get() findAll(@Request() req, @Query('branchId') b?: string, @Query('industry') i?: string, @Query('status') s?: string) { return this.service.findAll(req.user, b, i, s); }
  @Get('availability') getAvailability(@Query('branchId') b: string, @Query('industry') i: string, @Query('startDate') s: string, @Query('endDate') e: string) { return this.service.getAvailability(b, i, s, e); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Post() create(@Body() dto: CreateBookingDto, @Request() req) { return this.service.create(dto, req.user); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateBookingDto) { return this.service.update(id, dto); }
  @Post(':id/prepay') @ApiOperation({ summary: 'Tính tiền trước khi nhận phòng' }) prepay(@Param('id') id: string, @Body() dto: PrepayDto) { return this.service.prepay(id, dto); }
  @Post(':id/check-in') checkIn(@Param('id') id: string) { return this.service.checkIn(id); }
  @Post(':id/check-out') checkOut(@Param('id') id: string) { return this.service.checkOut(id); }
}
