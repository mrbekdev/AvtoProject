import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('api/bootstrap')
export class BootstrapController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async bootstrap() {
    const categories = await this.prisma.category.findMany();
    const products = await this.prisma.product.findMany();
    const customers = await this.prisma.customer.findMany();
    
    // Sort sales descending by createdAt
    const sales = await this.prisma.sale.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const debtPayments = await this.prisma.debtPayment.findMany();
    
    let settings = await this.prisma.settings.findFirst({
      where: { id: 'singleton' },
    });

    // Fallback settings if not seeded
    if (!settings) {
      settings = await this.prisma.settings.create({
        data: {
          id: 'singleton',
          storeName: "Авто Эҳтиёт Қисмлари До'кони",
          phone: "+998 90 123 45 67",
          address: "Тошкент шаҳри",
          employee: "Сотувчи",
        },
      });
    }

    // Convert DateTime fields to Unix timestamps (milliseconds) to match the frontend expectations
    return {
      categories,
      products,
      customers: customers.map(c => ({
        ...c,
        createdAt: c.createdAt.getTime(),
      })),
      sales: sales.map(s => ({
        ...s,
        createdAt: s.createdAt.getTime(),
      })),
      debtPayments: debtPayments.map(p => ({
        ...p,
        createdAt: p.createdAt.getTime(),
      })),
      settings,
    };
  }
}
