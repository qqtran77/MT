import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InventoryItem, InventoryItemDocument } from './schemas/inventory.schema';
import { StockMovement, StockMovementDocument } from './schemas/stock-movement.schema';
import { CreateInventoryItemDto, UpdateInventoryItemDto, StockMovementDto } from './dto/inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(InventoryItem.name) private itemModel: Model<InventoryItemDocument>,
    @InjectModel(StockMovement.name) private movementModel: Model<StockMovementDocument>,
  ) {}

  findAll(user: any, branchId?: string) {
    const filter: any = { ...(user.tenantId ? { tenantId: user.tenantId } : {}), isActive: true };
    if (branchId) filter.branchId = new Types.ObjectId(branchId);
    return this.itemModel.find(filter).sort({ name: 1 }).lean();
  }

  findLowStock(user: any) {
    return this.itemModel.find({ ...(user.tenantId ? { tenantId: user.tenantId } : {}), isActive: true, $expr: { $lte: ['$quantity', '$minQuantity'] } }).lean();
  }

  async create(dto: CreateInventoryItemDto, user: any) {
    return this.itemModel.create({ ...dto, branchId: new Types.ObjectId(dto.branchId), tenantId: user.tenantId });
  }

  async update(id: string, dto: UpdateInventoryItemDto) {
    const item = await this.itemModel.findByIdAndUpdate(id, dto, { new: true });
    if (!item) throw new NotFoundException('Không tìm thấy sản phẩm');
    return item;
  }

  async addMovement(dto: StockMovementDto, user: any) {
    const item = await this.itemModel.findById(dto.itemId);
    if (!item) throw new NotFoundException('Không tìm thấy sản phẩm');
    const delta = dto.type === 'out' ? -dto.quantity : dto.quantity;
    item.quantity = Math.max(0, item.quantity + delta);
    await item.save();
    return this.movementModel.create({ ...dto, itemId: new Types.ObjectId(dto.itemId), branchId: item.branchId, createdBy: user._id });
  }

  getMovements(itemId: string) {
    return this.movementModel.find({ itemId: new Types.ObjectId(itemId) }).sort({ createdAt: -1 }).limit(50).lean();
  }
}
