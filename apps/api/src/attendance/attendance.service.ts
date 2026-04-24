import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance, AttendanceDocument } from './schemas/attendance.schema';
import { CreateAttendanceDto, UpdateAttendanceDto } from './dto/attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(@InjectModel(Attendance.name) private model: Model<AttendanceDocument>) {}

  async findAll(user: any, branchId?: string, startDate?: string, endDate?: string) {
    const filter: any = { tenantId: user.tenantId };
    if (branchId) filter.branchId = new Types.ObjectId(branchId);
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    return this.model.find(filter).populate('staffId', 'fullName position').sort({ date: -1 }).lean();
  }

  async create(dto: CreateAttendanceDto, user: any) {
    const record = new this.model({
      ...dto,
      staffId: new Types.ObjectId(dto.staffId),
      branchId: new Types.ObjectId(dto.branchId),
      tenantId: user.tenantId,
      date: new Date(dto.date),
      checkIn: dto.checkIn ? new Date(dto.checkIn) : undefined,
      checkOut: dto.checkOut ? new Date(dto.checkOut) : undefined,
    });
    if (record.checkIn && record.checkOut) {
      record.totalHours = (record.checkOut.getTime() - record.checkIn.getTime()) / 3600000;
    }
    return record.save();
  }

  async checkIn(staffId: string, user: any) {
    const today = new Date(); today.setHours(0,0,0,0);
    const existing = await this.model.findOne({ staffId: new Types.ObjectId(staffId), date: today });
    if (existing) { existing.checkIn = new Date(); return existing.save(); }
    return this.model.create({ staffId: new Types.ObjectId(staffId), branchId: user.branchId, tenantId: user.tenantId, date: today, checkIn: new Date(), status: 'present' });
  }

  async checkOut(staffId: string, user: any) {
    const today = new Date(); today.setHours(0,0,0,0);
    const record = await this.model.findOne({ staffId: new Types.ObjectId(staffId), date: today });
    if (!record) throw new NotFoundException('Chưa có bản ghi chấm công hôm nay');
    record.checkOut = new Date();
    if (record.checkIn) record.totalHours = (record.checkOut.getTime() - record.checkIn.getTime()) / 3600000;
    return record.save();
  }

  async update(id: string, dto: UpdateAttendanceDto) {
    const record = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!record) throw new NotFoundException('Không tìm thấy bản ghi');
    return record;
  }
}
