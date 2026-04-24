import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Branch, BranchDocument } from './schemas/branch.schema';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';

@Injectable()
export class BranchesService {
  constructor(
    @InjectModel(Branch.name) private branchModel: Model<BranchDocument>,
  ) {}

  async findAll(user: any, tenantId?: string, industry?: string) {
    const filter: any = {};

    if (user.role === 'admin') {
      if (tenantId) filter.tenantId = new Types.ObjectId(tenantId);
    } else {
      filter.tenantId = user.tenantId;
    }

    if (industry) filter.industry = industry;

    return this.branchModel.find(filter).sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string) {
    const branch = await this.branchModel.findById(id).lean();
    if (!branch) throw new NotFoundException('Không tìm thấy chi nhánh');
    return branch;
  }

  async create(createBranchDto: CreateBranchDto) {
    const branch = new this.branchModel({
      ...createBranchDto,
      tenantId: new Types.ObjectId(createBranchDto.tenantId),
    });
    return branch.save();
  }

  async update(id: string, updateBranchDto: UpdateBranchDto, user: any) {
    const branch = await this.branchModel.findById(id);
    if (!branch) throw new NotFoundException('Không tìm thấy chi nhánh');

    // Non-admin can only update their tenant's branches
    if (user.role !== 'admin' && branch.tenantId.toString() !== user.tenantId?.toString()) {
      throw new ForbiddenException('Không có quyền cập nhật chi nhánh này');
    }

    Object.assign(branch, updateBranchDto);
    return branch.save();
  }

  async remove(id: string, user: any) {
    const branch = await this.branchModel.findById(id);
    if (!branch) throw new NotFoundException('Không tìm thấy chi nhánh');

    if (user.role !== 'admin' && branch.tenantId.toString() !== user.tenantId?.toString()) {
      throw new ForbiddenException('Không có quyền xóa chi nhánh này');
    }

    // Soft delete
    branch.isActive = false;
    await branch.save();
    return { message: 'Đã xóa chi nhánh thành công' };
  }
}
