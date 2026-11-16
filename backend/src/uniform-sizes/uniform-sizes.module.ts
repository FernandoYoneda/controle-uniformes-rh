import { Module } from '@nestjs/common';
import { UniformSizesService } from './uniform-sizes.service';
import { UniformSizesController } from './uniform-sizes.controller';

@Module({
  controllers: [UniformSizesController],
  providers: [UniformSizesService],
})
export class UniformSizesModule {}
