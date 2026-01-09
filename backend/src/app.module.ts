import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MenuModule } from './menu/menu.module';
import { OrderModule } from './order/order.module';
import { AdminModule } from './admin/admin.module';
import { DiscountModule } from './discount/discount.module';

@Module({
  imports: [PrismaModule, MenuModule, OrderModule, AdminModule, DiscountModule],
})
export class AppModule {}
