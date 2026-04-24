import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('branches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách chi nhánh' })
  @ApiQuery({ name: 'tenantId', required: false })
  @ApiQuery({ name: 'industry', required: false, enum: ['hotel', 'cafe', 'cinema'] })
  async findAll(
    @Request() req,
    @Query('tenantId') tenantId?: string,
    @Query('industry') industry?: string,
  ) {
    return this.branchesService.findAll(req.user, tenantId, industry);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'branch_manager')
  @ApiOperation({ summary: 'Tạo chi nhánh mới' })
  async create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật chi nhánh' })
  async update(
    @Param('id') id: string,
    @Body() updateBranchDto: UpdateBranchDto,
    @Request() req,
  ) {
    return this.branchesService.update(id, updateBranchDto, req.user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'branch_manager')
  @ApiOperation({ summary: 'Xóa chi nhánh' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.branchesService.remove(id, req.user);
  }
}
