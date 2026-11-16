import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUniformStockMovementDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
