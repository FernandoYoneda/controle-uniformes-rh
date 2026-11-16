import { PartialType } from '@nestjs/mapped-types';
import { CreateUniformSizeDto } from './create-uniform-size.dto';

export class UpdateUniformSizeDto extends PartialType(CreateUniformSizeDto) {}
