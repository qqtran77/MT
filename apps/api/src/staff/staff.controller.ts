import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('staff')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách nhân viên' })
  findAll(@Request() req, @Query('branchId') branchId?: string) {
    return this.staffService.findAll(req.user, branchId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'branch_manager')
  @ApiOperation({ summary: 'Thêm nhân viên mới' })
  create(@Body() dto: CreateStaffDto, @Request() req) {
    return this.staffService.create(dto, req.user);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'branch_manager')
  update(@Param('id') id: string, @Body() dto: UpdateStaffDto) {
    return this.staffService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'branch_manager')
  remove(@Param('id') id: string) {
    return this.staffService.remove(id);
  }
}
