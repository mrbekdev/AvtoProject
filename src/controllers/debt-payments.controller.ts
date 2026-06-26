import { Controller, Get, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

interface CreateDebtPaymentDto {
  customerId: string;
  saleId?: string;
  amount: number;
}

@Controller('api/debt-payments')
export class DebtPaymentsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    const payments = await this.prisma.debtPayment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return payments.map(p => ({
      ...p,
      createdAt: p.createdAt.getTime(),
    }));
  }

  @Post()
  async create(@Body() body: CreateDebtPaymentDto) {
    const payment = await this.prisma.debtPayment.create({
      data: {
        customerId: body.customerId,
        saleId: body.saleId || null,
        amount: body.amount,
      },
    });
    return {
      ...payment,
      createdAt: payment.createdAt.getTime(),
    };
  }
}
