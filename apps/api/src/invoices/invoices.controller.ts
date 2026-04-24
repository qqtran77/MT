import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly service: InvoicesService) {}
  @Get() findAll(@Request() req, @Query('branchId') branchId?: string, @Query('status') status?: string) { return this.service.findAll(req.user, branchId, status); }
  @Get('stats') getStats(@Request() req, @Query('branchId') branchId?: string, @Query('period') period?: string) { return this.service.getStats(req.user, branchId, period); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Post() create(@Body() dto: CreateInvoiceDto, @Request() req) { return this.service.create(dto, req.user); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateInvoiceDto) { return this.service.update(id, dto); }
}
