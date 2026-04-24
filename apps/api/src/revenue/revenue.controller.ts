import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RevenueService } from './revenue.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('revenue')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('revenue')
export class RevenueController {
  constructor(private readonly service: RevenueService) {}
  @Get('dashboard') getDashboard(@Request() req, @Query('branchId') b?: string) { return this.service.getDashboard(req.user, b); }
  @Get('chart') getChart(@Request() req, @Query('branchId') b?: string, @Query('days') d?: number) { return this.service.getChartData(req.user, b, d); }
  @Get('by-branch') getByBranch(@Request() req, @Query('month') m?: string) { return this.service.getByBranch(req.user, m); }
  @Get('top-products') getTopProducts(@Request() req, @Query('branchId') b?: string, @Query('limit') l?: number) { return this.service.getTopProducts(req.user, b, l); }
}
