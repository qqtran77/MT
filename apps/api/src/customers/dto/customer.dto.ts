import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
export class CreateCustomerDto {
  @ApiProperty() @IsString() fullName: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
}
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
