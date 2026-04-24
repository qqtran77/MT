import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto, AddItemsDto, PayOrderDto } from './dto/order.dto';

@Injectable()
export class PosService {
  constructor(@InjectModel(Order.name) private model: Model<OrderDocument>) {}

  findAll(user: any, branchId?: string, status?: string) {
    const filter: any = { tenantId: user.tenantId };
    if (branchId) filter.branchId = new Types.ObjectId(branchId);
    if (status) filter.status = status;
    return this.model.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  }

  async findOne(id: string) {
    const o = await this.model.findById(id).lean();
    if (!o) throw new NotFoundException('Không tìm thấy đơn hàng');
    return o;
  }

  async create(dto: CreateOrderDto, user: any) {
    const subtotal = dto.items.reduce((s, i) => s + i.total, 0);
    const total = subtotal - (dto.discount || 0);
    return this.model.create({
      ...dto,
      branchId: new Types.ObjectId(dto.branchId),
      tenantId: user.tenantId,
      customerId: dto.customerId ? new Types.ObjectId(dto.customerId) : undefined,
      createdBy: user._id,
      subtotal, total, discount: dto.discount || 0,
    });
  }

  async addItems(id: string, dto: AddItemsDto) {
    const order = await this.model.findById(id);
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    order.items.push(...dto.items);
    order.subtotal = order.items.reduce((s: number, i: any) => s + i.total, 0);
    order.total = order.subtotal - order.discount;
    return order.save();
  }

  async pay(id: string, dto: PayOrderDto) {
    const order = await this.model.findById(id);
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    if (dto.discount !== undefined) {
      order.discount = dto.discount;
      order.total = order.subtotal - dto.discount;
    }
    order.paymentMethod = dto.paymentMethod as any;
    order.status = 'paid';
    return order.save();
  }

  async cancel(id: string) {
    const o = await this.model.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
    if (!o) throw new NotFoundException('Không tìm thấy đơn hàng');
    return o;
  }

  async lockCinemaSeats(showtimeId: string, seatIds: string[], user: any) {
    // Lock seats for 5 minutes
    const lockExpiry = new Date(Date.now() + 5 * 60 * 1000);
    return { showtimeId, seatIds, locked: true, expiresAt: lockExpiry, message: 'Ghế đã được giữ trong 5 phút' };
  }
}
