import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type StockMovementDocument = StockMovement & Document;

@Schema({ timestamps: true, collection: 'stock_movements' })
export class StockMovement {
  @Prop({ type: Types.ObjectId, ref: 'InventoryItem', required: true }) itemId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true }) branchId: Types.ObjectId;
  @Prop({ enum: ['in', 'out', 'adjust'], required: true }) type: string;
  @Prop({ required: true }) quantity: number;
  @Prop() reason: string;
  @Prop({ type: Types.ObjectId, ref: 'User' }) createdBy: Types.ObjectId;
  createdAt: Date;
}
export const StockMovementSchema = SchemaFactory.createForClass(StockMovement);
