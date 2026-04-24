import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly service: CustomersService) {}
  @Get() findAll(@Request() req, @Query('search') search?: string) { return this.service.findAll(req.user, search); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Post() create(@Body() dto: CreateCustomerDto, @Request() req) { return this.service.create(dto, req.user); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) { return this.service.update(id, dto); }
}
