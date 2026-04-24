import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Staff, StaffDocument } from './schemas/staff.schema';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
  ) {}

  async findAll(user: any, branchId?: string) {
    const filter: any = { isDeleted: false };

    if (branchId) {
      filter.branchId = new Types.ObjectId(branchId);
    } else if (user.role !== 'admin' && user.tenantId) {
      filter.tenantId = user.tenantId;
    }

    return this.staffModel.find(filter).sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string) {
    const staff = await this.staffModel
      .findOne({ _id: id, isDeleted: false })
      .lean();
    if (!staff) throw new NotFoundException('Không tìm thấy nhân viên');
    return staff;
  }

  async create(createStaffDto: CreateStaffDto, user: any) {
    const existing = await this.staffModel.findOne({
      employeeCode: createStaffDto.employeeCode,
    });
    if (existing) {
      throw new ConflictException('Mã nhân viên đã tồn tại');
    }

    const staff = new this.staffModel({
      ...createStaffDto,
      tenantId: new Types.ObjectId(createStaffDto.tenantId || user.tenantId),
      branchId: new Types.ObjectId(createStaffDto.branchId),
      positionId: createStaffDto.positionId
        ? new Types.ObjectId(createStaffDto.positionId)
        : null,
      hiredAt: createStaffDto.hiredAt ? new Date(createStaffDto.hiredAt) : null,
    });

    return staff.save();
  }

  async update(id: string, updateStaffDto: UpdateStaffDto) {
    const staff = await this.staffModel.findOne({ _id: id, isDeleted: false });
    if (!staff) throw new NotFoundException('Không tìm thấy nhân viên');

    if (updateStaffDto.branchId) {
      (updateStaffDto as any).branchId = new Types.ObjectId(updateStaffDto.branchId);
    }
    if (updateStaffDto.positionId) {
      (updateStaffDto as any).positionId = new Types.ObjectId(updateStaffDto.positionId);
    }

    Object.assign(staff, updateStaffDto);
    return staff.save();
  }

  async remove(id: string) {
    const staff = await this.staffModel.findOne({ _id: id, isDeleted: false });
    if (!staff) throw new NotFoundException('Không tìm thấy nhân viên');
    staff.isDeleted = true;
    await staff.save();
    return { message: 'Đã xóa nhân viên thành công' };
  }
}
