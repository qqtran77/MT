import { IsString, IsNumber, IsArray, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() productId?: string;
  @ApiProperty() @IsNumber() quantity: number;
  @ApiProperty() @IsNumber() unitPrice: number;
  @ApiProperty() @IsNumber() total: number;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}

export class CreateOrderDto {
  @ApiProperty() @IsString() branchId: string;
  @ApiPropertyOptional({ enum: ['dine_in','take_away','room_charge','cinema'] }) @IsOptional() @IsEnum(['dine_in','take_away','room_charge','cinema']) orderType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tableId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tableName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() roomId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() showtimeId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerId?: string;
  @ApiProperty({ type: [OrderItemDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => OrderItemDto) items: OrderItemDto[];
  @ApiPropertyOptional() @IsOptional() @IsNumber() discount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}

export class AddItemsDto {
  @ApiProperty({ type: [OrderItemDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => OrderItemDto) items: OrderItemDto[];
}

export class PayOrderDto {
  @ApiProperty({ enum: ['cash','card','transfer','momo','vnpay','room_charge'] }) @IsEnum(['cash','card','transfer','momo','vnpay','room_charge']) paymentMethod: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() discount?: number;
}
