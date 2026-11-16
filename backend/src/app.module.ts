import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { StoresModule } from './stores/stores.module';
import { EmployeesModule } from './employees/employees.module';
import { UniformProductsModule } from './uniform-products/uniform-products.module';
import { UniformSizesModule } from './uniform-sizes/uniform-sizes.module';
import { UniformVariantsModule } from './uniform-variants/uniform-variants.module';
import { UniformStockMovementsModule } from './uniform-stock-movements/uniform-stock-movements.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, StoresModule, EmployeesModule, UniformProductsModule, UniformSizesModule, UniformVariantsModule, UniformStockMovementsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
