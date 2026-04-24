import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type InvoiceDocument = Invoice & Document;

@Schema({ timestamps: true, collection: 'invoices' })
export class Invoice {
  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true }) branchId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true }) tenantId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Customer' }) customerId: Types.ObjectId;
  @Prop({ unique: true, trim: true }) invoiceNo: string;
  @Prop({ enum: ['pos', 'booking', 'counter'], default: 'pos' }) source: string;
  @Prop({ type: [{ name: String, quantity: Number, unitPrice: Number, total: Number }] }) items: any[];
  @Prop({ default: 0 }) subtotal: number;
  @Prop({ default: 0 }) discount: number;
  @Prop({ default: 0 }) tax: number;
  @Prop({ default: 0 }) total: number;
  @Prop({ enum: ['pending', 'paid', 'refunded', 'cancelled'], default: 'pending' }) status: string;
  @Prop({ enum: ['cash', 'card', 'transfer', 'momo', 'vnpay', 'room_charge'], default: 'cash' }) paymentMethod: string;
  @Prop() paidAt: Date;
  @Prop({ type: Types.ObjectId, ref: 'User' }) createdBy: Types.ObjectId;
  @Prop({ trim: true }) note: string;
  createdAt: Date; updatedAt: Date;
}
export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
InvoiceSchema.index({ branchId: 1, createdAt: -1 });
InvoiceSchema.index({ tenantId: 1, status: 1 });
InvoiceSchema.pre('save', function(next) {
  if (!this.invoiceNo) {
    this.invoiceNo = 'INV-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});
