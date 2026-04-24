import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type OrderDocument = Order & Document;

@Schema({ timestamps: true, collection: 'pos_orders' })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true }) branchId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true }) tenantId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Customer' }) customerId: Types.ObjectId;
  @Prop({ unique: true }) orderNo: string;
  @Prop({ enum: ['dine_in','take_away','room_charge','cinema'], default: 'dine_in' }) orderType: string;
  @Prop() tableId: string;
  @Prop() tableName: string;
  @Prop() roomId: string;
  @Prop() showtimeId: string;
  @Prop({ type: [{ productId: String, name: String, quantity: Number, unitPrice: Number, total: Number, note: String }] }) items: any[];
  @Prop({ default: 0 }) subtotal: number;
  @Prop({ default: 0 }) discount: number;
  @Prop({ default: 0 }) total: number;
  @Prop({ enum: ['open','serving','paid','cancelled'], default: 'open' }) status: string;
  @Prop({ enum: ['cash','card','transfer','momo','vnpay','room_charge'], default: 'cash' }) paymentMethod: string;
  @Prop({ type: Types.ObjectId, ref: 'User' }) createdBy: Types.ObjectId;
  @Prop({ trim: true }) note: string;
  createdAt: Date; updatedAt: Date;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ branchId: 1, status: 1 });
OrderSchema.pre('save', function(next) {
  if (!this.orderNo) this.orderNo = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2,4).toUpperCase();
  next();
});
