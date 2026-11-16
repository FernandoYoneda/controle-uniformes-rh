import { Module } from '@nestjs/common';
import { UniformProductsService } from './uniform-products.service';
import { UniformProductsController } from './uniform-products.controller';

@Module({
  controllers: [UniformProductsController],
  providers: [UniformProductsService],
})
export class UniformProductsModule {}
