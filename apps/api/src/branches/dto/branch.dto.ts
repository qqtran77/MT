import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Industry } from '../schemas/branch.schema';

export class CreateBranchDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  tenantId: string;

  @ApiProperty({ example: 'Chi nhánh Quận 1' })
  @IsString()
  name: string;

  @ApiProperty({ enum: Industry, example: Industry.HOTEL })
  @IsEnum(Industry)
  industry: Industry;

  @ApiPropertyOptional({ example: '123 Nguyễn Huệ, Q.1, TP.HCM' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '028-1234-5678' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
