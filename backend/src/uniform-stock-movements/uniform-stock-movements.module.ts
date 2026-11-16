import { Module } from '@nestjs/common';
import { UniformStockMovementsService } from './uniform-stock-movements.service';
import { UniformStockMovementsController } from './uniform-stock-movements.controller';

@Module({
  controllers: [UniformStockMovementsController],
  providers: [UniformStockMovementsService],
})
export class UniformStockMovementsModule {}
