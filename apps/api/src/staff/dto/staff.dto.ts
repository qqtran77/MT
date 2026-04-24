import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsEmail,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { ContractType, StaffStatus } from '../schemas/staff.schema';
import { Type } from 'class-transformer';

export class CreateStaffDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  tenantId: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  branchId: string;

  @ApiProperty({ example: 'NV001' })
  @IsString()
  employeeCode: string;

  @ApiProperty({ example: 'Nguyễn Văn An' })
  @IsString()
  fullName: string;

  @ApiPropertyOptional({ example: '0901234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'nvan@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsString()
  positionId?: string;

  @ApiPropertyOptional({ example: 'Nhân viên lễ tân' })
  @IsOptional()
  @IsString()
  positionName?: string;

  @ApiPropertyOptional({ enum: ContractType, example: ContractType.FULL })
  @IsOptional()
  @IsEnum(ContractType)
  contractType?: ContractType;

  @ApiPropertyOptional({ example: 8000000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  baseSalary?: number;

  @ApiPropertyOptional({ enum: StaffStatus, example: StaffStatus.PROBATION })
  @IsOptional()
  @IsEnum(StaffStatus)
  status?: StaffStatus;

  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  hiredAt?: string;
}

export class UpdateStaffDto extends PartialType(CreateStaffDto) {}
