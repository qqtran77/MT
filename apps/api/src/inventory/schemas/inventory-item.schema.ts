import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InventoryItemDocument = InventoryItem & Document;

@Schema({ timestamps: true, collection: 'inventory_items' })
export class InventoryItem {
  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branchId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  quantity: number;

  @Prop({ type: Date, default: Date.now })
  lastUpdated: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const InventoryItemSchema = SchemaFactory.createForClass(InventoryItem);
InventoryItemSchema.index({ branchId: 1, productId: 1 }, { unique: true });
InventoryItemSchema.index({ branchId: 1 });
