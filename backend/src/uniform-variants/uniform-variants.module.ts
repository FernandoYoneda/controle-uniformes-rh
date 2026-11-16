import { Module } from '@nestjs/common';
import { UniformVariantsService } from './uniform-variants.service';
import { UniformVariantsController } from './uniform-variants.controller';

@Module({
  controllers: [UniformVariantsController],
  providers: [UniformVariantsService],
})
export class UniformVariantsModule {}
