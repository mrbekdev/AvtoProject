import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { BootstrapController } from './controllers/bootstrap.controller';
import { CategoriesController } from './controllers/categories.controller';
import { ProductsController } from './controllers/products.controller';
import { CustomersController } from './controllers/customers.controller';
import { SalesController } from './controllers/sales.controller';
import { DebtPaymentsController } from './controllers/debt-payments.controller';
import { SettingsController } from './controllers/settings.controller';

@Module({
  imports: [],
  controllers: [
    BootstrapController,
    CategoriesController,
    ProductsController,
    CustomersController,
    SalesController,
    DebtPaymentsController,
    SettingsController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
