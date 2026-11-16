import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

import {
  UniformCondition,
  UniformMovementType,
} from '../../../generated/prisma/client';

export class CreateUniformStockMovementDto {
  @IsUUID()
  variantId: string;

  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsEnum(UniformMovementType)
  type: UniformMovementType;

  @IsEnum(UniformCondition)
  condition: UniformCondition;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitCost?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
