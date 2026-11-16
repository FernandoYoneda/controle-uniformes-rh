import { PartialType } from '@nestjs/mapped-types';
import { CreateUniformProductDto } from './create-uniform-product.dto';

export class UpdateUniformProductDto extends PartialType(
  CreateUniformProductDto,
) {}
