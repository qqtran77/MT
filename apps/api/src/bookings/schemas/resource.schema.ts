import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResourceDocument = Resource & Document;

export enum ResourceType {
  ROOM = 'room',
  TABLE = 'table',
  SEAT = 'seat',
}

export enum ResourceStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
}

@Schema({ timestamps: true, collection: 'resources' })
export class Resource {
  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branchId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(ResourceType),
    required: true,
  })
  type: ResourceType;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Number, default: 1 })
  capacity: number;

  @Prop({
    type: String,
    enum: Object.values(ResourceStatus),
    default: ResourceStatus.AVAILABLE,
  })
  status: ResourceStatus;

  @Prop({ trim: true })
  floor: string;

  @Prop({ trim: true })
  zone: string;

  @Prop({ trim: true }) // hotel | cafe | cinema
  industry: string;

  createdAt: Date;
  updatedAt: Date;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);
ResourceSchema.index({ branchId: 1, type: 1, status: 1 });
ResourceSchema.index({ branchId: 1, industry: 1 });
