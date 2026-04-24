import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomersService {
  constructor(@InjectModel(Customer.name) private model: Model<CustomerDocument>) {}

  findAll(user: any, search?: string) {
    const filter: any = { ...(user.tenantId ? { tenantId: user.tenantId } : {}), isActive: true };
    if (search) filter.$or = [{ fullName: { $regex: search, $options: 'i' } }, { phone: { $regex: search } }, { email: { $regex: search, $options: 'i' } }];
    return this.model.find(filter).sort({ totalSpent: -1 }).limit(100).lean();
  }

  async findOne(id: string) {
    const c = await this.model.findById(id).lean();
    if (!c) throw new NotFoundException('Không tìm thấy khách hàng');
    return c;
  }

  create(dto: CreateCustomerDto, user: any) {
    return this.model.create({ ...dto, tenantId: user.tenantId });
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const c = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!c) throw new NotFoundException('Không tìm thấy khách hàng');
    return c;
  }

  async addPoints(id: string, points: number, spent: number) {
    const c = await this.model.findById(id);
    if (!c) return;
    c.loyaltyPoints += points;
    c.totalSpent += spent;
    if (c.totalSpent >= 50000000) c.tier = 'platinum';
    else if (c.totalSpent >= 20000000) c.tier = 'gold';
    else if (c.totalSpent >= 5000000) c.tier = 'silver';
    return c.save();
  }
}
