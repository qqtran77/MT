import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(@InjectModel(Invoice.name) private model: Model<InvoiceDocument>) {}

  findAll(user: any, branchId?: string, status?: string) {
    const filter: any = { tenantId: user.tenantId };
    if (branchId) filter.branchId = new Types.ObjectId(branchId);
    if (status) filter.status = status;
    return this.model.find(filter).populate('customerId','fullName phone').sort({ createdAt: -1 }).limit(100).lean();
  }

  findOne(id: string) {
    return this.model.findById(id).populate('customerId','fullName phone email').lean();
  }

  async create(dto: CreateInvoiceDto, user: any) {
    const subtotal = dto.items.reduce((s, i) => s + i.total, 0);
    const discount = dto.discount || 0;
    const tax = dto.tax || 0;
    const total = subtotal - discount + tax;
    return this.model.create({
      ...dto,
      branchId: new Types.ObjectId(dto.branchId),
      tenantId: user.tenantId,
      customerId: dto.customerId ? new Types.ObjectId(dto.customerId) : undefined,
      createdBy: user._id,
      subtotal, discount, tax, total,
      status: 'paid',
      paidAt: new Date(),
    });
  }

  async update(id: string, dto: UpdateInvoiceDto) {
    const inv = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!inv) throw new NotFoundException('Không tìm thấy hóa đơn');
    return inv;
  }

  async getStats(user: any, branchId?: string, period = 'today') {
    const now = new Date();
    let start: Date;
    if (period === 'today') { start = new Date(now); start.setHours(0,0,0,0); }
    else if (period === 'week') { start = new Date(now); start.setDate(now.getDate() - 7); }
    else { start = new Date(now); start.setDate(1); start.setHours(0,0,0,0); }

    const filter: any = { tenantId: user.tenantId, status: 'paid', createdAt: { $gte: start } };
    if (branchId) filter.branchId = new Types.ObjectId(branchId);
    const result = await this.model.aggregate([
      { $match: filter },
      { $group: { _id: null, totalRevenue: { $sum: '$total' }, count: { $sum: 1 }, avgOrder: { $avg: '$total' } } }
    ]);
    return result[0] || { totalRevenue: 0, count: 0, avgOrder: 0 };
  }
}
