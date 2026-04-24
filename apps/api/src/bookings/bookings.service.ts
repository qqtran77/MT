import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto, UpdateBookingDto, PrepayDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(@InjectModel(Booking.name) private model: Model<BookingDocument>) {}

  findAll(user: any, branchId?: string, industry?: string, status?: string) {
    const filter: any = { ...(user.tenantId ? { tenantId: user.tenantId } : {}) };
    if (branchId) filter.branchId = new Types.ObjectId(branchId);
    if (industry) filter.industry = industry;
    if (status) filter.status = status;
    return this.model.find(filter).populate('customerId', 'fullName phone').sort({ createdAt: -1 }).limit(200).lean();
  }

  async findOne(id: string) {
    const b = await this.model.findById(id).populate('customerId', 'fullName phone email').lean();
    if (!b) throw new NotFoundException('Không tìm thấy booking');
    return b;
  }

  async create(dto: CreateBookingDto, user: any) {
    return this.model.create({
      ...dto,
      branchId: new Types.ObjectId(dto.branchId),
      tenantId: user.tenantId,
      customerId: dto.customerId ? new Types.ObjectId(dto.customerId) : undefined,
      createdBy: user._id,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    });
  }

  async update(id: string, dto: UpdateBookingDto) {
    const b = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!b) throw new NotFoundException('Không tìm thấy booking');
    return b;
  }

  async prepay(id: string, dto: PrepayDto) {
    const b = await this.model.findById(id);
    if (!b) throw new NotFoundException('Không tìm thấy booking');
    b.prepayType = dto.type as any;
    if (dto.type === 'full') {
      b.paidAmount = b.totalAmount;
      b.paymentStatus = 'paid' as any;
    } else if (dto.type === 'deposit') {
      b.depositAmount = dto.amount || b.totalAmount * 0.3;
      b.paidAmount = b.depositAmount;
      b.paymentStatus = 'partial' as any;
    } else if (dto.type === 'preauth') {
      // Pre-auth: hold 110%
      b.depositAmount = Math.ceil(b.totalAmount * 1.1);
      b.paymentStatus = 'partial' as any;
    }
    b.status = 'confirmed';
    return b.save();
  }

  async checkIn(id: string) {
    const b = await this.model.findByIdAndUpdate(id, { status: 'checked_in' }, { new: true });
    if (!b) throw new NotFoundException('Không tìm thấy booking');
    return b;
  }

  async checkOut(id: string) {
    const b = await this.model.findById(id);
    if (!b) throw new NotFoundException('Không tìm thấy booking');
    b.status = 'checked_out';
    if (b.prepayType === 'preauth') { b.paidAmount = b.totalAmount; b.paymentStatus = 'paid' as any; }
    return b.save();
  }

  async getAvailability(branchId: string, industry: string, startDate: string, endDate: string) {
    const booked = await this.model.find({
      branchId: new Types.ObjectId(branchId), industry,
      status: { $in: ['confirmed', 'checked_in'] },
      startDate: { $lt: new Date(endDate) },
      endDate: { $gt: new Date(startDate) },
    }).select('resourceId resourceName').lean();
    return { bookedResources: booked.map(b => b.resourceId) };
  }
}
