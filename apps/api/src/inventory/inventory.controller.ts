import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryItemDto, UpdateInventoryItemDto, StockMovementDto } from './dto/inventory.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}
  @Get() findAll(@Request() req, @Query('branchId') branchId?: string) { return this.service.findAll(req.user, branchId); }
  @Get('low-stock') findLowStock(@Request() req) { return this.service.findLowStock(req.user); }
  @Get(':id/movements') getMovements(@Param('id') id: string) { return this.service.getMovements(id); }
  @Post() create(@Body() dto: CreateInventoryItemDto, @Request() req) { return this.service.create(dto, req.user); }
  @Post('movement') addMovement(@Body() dto: StockMovementDto, @Request() req) { return this.service.addMovement(dto, req.user); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateInventoryItemDto) { return this.service.update(id, dto); }
}
