import { Controller, Get, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

interface SaleItemDto {
  productId: string;
  name: string;
  unitPrice: number;
  purchasePrice: number;
  quantity: number;
}

interface CreateSaleDto {
  customerId?: string;
  items: SaleItemDto[];
  subtotal: number;
  discount: number;
  total: number;
  paymentType: string;
  downPayment?: number;
  remainingDebt?: number;
  employee?: string;
}

@Controller('api/sales')
export class SalesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    const sales = await this.prisma.sale.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return sales.map(s => ({
      ...s,
      createdAt: s.createdAt.getTime(),
    }));
  }

  @Post()
  async create(@Body() body: CreateSaleDto) {
    const sale = await this.prisma.$transaction(async (tx) => {
      // 1. Update product quantities in stock
      for (const item of body.items) {
        const prod = await tx.product.findUnique({
          where: { id: item.productId },
        });
        if (prod) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              quantity: Math.max(0, prod.quantity - item.quantity),
            },
          });
        }
      }

      // 2. Fetch active employee from settings if not supplied in body
      let employeeName = body.employee;
      if (!employeeName) {
        const settings = await tx.settings.findFirst({
          where: { id: 'singleton' },
        });
        employeeName = settings?.employee || 'Сотувчи';
      }

      // 3. Generate invoice number
      const count = await tx.sale.count();
      const invoiceNumber = '#' + String(count + 1001);

      // 4. Record sale
      return tx.sale.create({
        data: {
          invoiceNumber,
          employee: employeeName,
          customerId: body.customerId || null,
          subtotal: body.subtotal,
          discount: body.discount,
          total: body.total,
          paymentType: body.paymentType,
          downPayment: body.downPayment ?? null,
          remainingDebt: body.remainingDebt ?? null,
          items: {
            create: body.items.map(i => ({
              productId: i.productId,
              name: i.name,
              unitPrice: i.unitPrice,
              purchasePrice: i.purchasePrice,
              quantity: i.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });
    });

    return {
      ...sale,
      createdAt: sale.createdAt.getTime(),
    };
  }
}
