import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('api/customers')
export class CustomersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    const customers = await this.prisma.customer.findMany();
    return customers.map(c => ({
      ...c,
      createdAt: c.createdAt.getTime(),
    }));
  }

  @Post()
  async create(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      phone: string;
    },
  ) {
    const customer = await this.prisma.customer.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
      },
    });
    return {
      ...customer,
      createdAt: customer.createdAt.getTime(),
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      firstName?: string;
      lastName?: string;
      phone?: string;
    },
  ) {
    const customer = await this.prisma.customer.update({
      where: { id },
      data: body,
    });
    return {
      ...customer,
      createdAt: customer.createdAt.getTime(),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const customer = await this.prisma.customer.delete({
      where: { id },
    });
    return {
      ...customer,
      createdAt: customer.createdAt.getTime(),
    };
  }
}
