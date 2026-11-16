import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUniformVariantDto {
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
