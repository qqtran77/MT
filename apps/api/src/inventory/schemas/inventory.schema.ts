import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type InventoryItemDocument = InventoryItem & Document;

@Schema({ timestamps: true, collection: 'inventory_items' })
export class InventoryItem {
  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true }) branchId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true }) tenantId: Types.ObjectId;
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ trim: true }) sku: string;
  @Prop({ enum: ['ingredient', 'beverage', 'amenity', 'equipment', 'other'], default: 'other' }) category: string;
  @Prop({ default: 0 }) quantity: number;
  @Prop({ default: 0 }) minQuantity: number;
  @Prop({ trim: true }) unit: string;
  @Prop({ default: 0 }) costPrice: number;
  @Prop({ default: true }) isActive: boolean;
  createdAt: Date; updatedAt: Date;
}
export const InventoryItemSchema = SchemaFactory.createForClass(InventoryItem);
InventoryItemSchema.index({ branchId: 1, category: 1 });
