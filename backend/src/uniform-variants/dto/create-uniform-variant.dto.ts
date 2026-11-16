import { IsUUID } from 'class-validator';

export class CreateUniformVariantDto {
  @IsUUID()
  productId: string;

  @IsUUID()
  sizeId: string;
}
