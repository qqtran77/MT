import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommissionService } from './commission.service';

@ApiTags('commission')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('commission')
export class CommissionController {
  constructor(private readonly svc: CommissionService) {}

  @Get('my-code')
  getMyCode(@Request() req) {
    return this.svc.getOrCreateReferralCode(req.user._id.toString()).then(code => ({ referralCode: code, link: `/booking?ref=${code}` }));
  }

  @Get('my')
  getMy(@Request() req) {
    return this.svc.getMyCommissions(req.user._id.toString());
  }

  @Get('stats')
  getStats(@Request() req, @Query('referrerId') rid?: string) {
    return this.svc.getStats(rid || req.user._id.toString());
  }

  @Get('leaderboard')
  getLeaderboard() {
    return this.svc.getLeaderboard();
  }

  @Get()
  getAll(@Query('status') s?: string, @Query('referrerId') r?: string) {
    return this.svc.getAll({ status: s, referrerId: r });
  }

  @Post('record')
  record(@Body() body: { referralCode: string; bookingAmount: number; bookingId?: string; branchId?: string }) {
    return this.svc.recordCommission(body.referralCode, body.bookingAmount, body.bookingId, body.branchId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string; note?: string }) {
    return this.svc.updateStatus(id, body.status, body.note);
  }
}
