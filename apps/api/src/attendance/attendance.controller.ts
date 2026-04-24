import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto, UpdateAttendanceDto } from './dto/attendance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Get() findAll(@Request() req, @Query('branchId') branchId?: string, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.service.findAll(req.user, branchId, startDate, endDate);
  }

  @Post() create(@Body() dto: CreateAttendanceDto, @Request() req) { return this.service.create(dto, req.user); }

  @Post('check-in/:staffId') checkIn(@Param('staffId') staffId: string, @Request() req) { return this.service.checkIn(staffId, req.user); }

  @Post('check-out/:staffId') checkOut(@Param('staffId') staffId: string, @Request() req) { return this.service.checkOut(staffId, req.user); }

  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateAttendanceDto) { return this.service.update(id, dto); }
}
