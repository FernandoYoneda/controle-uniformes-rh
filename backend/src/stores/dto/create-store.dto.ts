import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  number: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;
}
