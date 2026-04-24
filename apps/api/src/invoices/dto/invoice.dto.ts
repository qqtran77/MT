import { IsString, IsNumber, IsArray, IsOptional, IsEnum, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class InvoiceItemDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsNumber() @Min(1) quantity: number;
  @ApiProperty() @IsNumber() @Min(0) unitPrice: number;
  @ApiProperty() @IsNumber() @Min(0) total: number;
}

export class CreateInvoiceDto {
  @ApiProperty() @IsString() branchId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerId?: string;
  @ApiProperty({ type: [InvoiceItemDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => InvoiceItemDto) items: InvoiceItemDto[];
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) discount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) tax?: number;
  @ApiPropertyOptional({ enum: ['cash','card','transfer','momo','vnpay','room_charge'] }) @IsOptional() @IsEnum(['cash','card','transfer','momo','vnpay','room_charge']) paymentMethod?: string;
  @ApiPropertyOptional({ enum: ['pos','booking','counter'] }) @IsOptional() @IsEnum(['pos','booking','counter']) source?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
  @ApiPropertyOptional({ enum: ['pending','paid','refunded','cancelled'] }) @IsOptional() @IsEnum(['pending','paid','refunded','cancelled']) status?: string;
}
