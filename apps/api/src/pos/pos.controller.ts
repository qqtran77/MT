import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PosService } from './pos.service';
import { CreateOrderDto, AddItemsDto, PayOrderDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('pos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pos')
export class PosController {
  constructor(private readonly service: PosService) {}
  @Get('orders') findAll(@Request() req, @Query('branchId') b?: string, @Query('status') s?: string) { return this.service.findAll(req.user, b, s); }
  @Get('orders/:id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Post('counter-orders') @ApiOperation({ summary: 'Order tại quầy (Cafe/Cinema/Hotel)' }) create(@Body() dto: CreateOrderDto, @Request() req) { return this.service.create(dto, req.user); }
  @Patch('counter-orders/:id/items') addItems(@Param('id') id: string, @Body() dto: AddItemsDto) { return this.service.addItems(id, dto); }
  @Post('counter-orders/:id/pay') pay(@Param('id') id: string, @Body() dto: PayOrderDto) { return this.service.pay(id, dto); }
  @Post('counter-orders/:id/cancel') cancel(@Param('id') id: string) { return this.service.cancel(id); }
  @Post('cinema/seats/lock') @ApiOperation({ summary: 'Lock ghế rạp 5 phút' }) lockSeats(@Body() body: { showtimeId: string; seatIds: string[] }, @Request() req) { return this.service.lockCinemaSeats(body.showtimeId, body.seatIds, req.user); }
}
