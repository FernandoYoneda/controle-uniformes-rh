import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUniformProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
