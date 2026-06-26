import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.product.findMany();
  }

  @Post()
  async create(
    @Body()
    body: {
      name: string;
      model?: string;
      categoryId: string;
      purchasePrice: number;
      sellingPrice: number;
      quantity: number;
      image?: string;
    },
  ) {
    // Auto-generate unique barcode
    const count = await this.prisma.product.count();
    const barcode = '86' + String(count + 10001).padStart(5, '0');

    return this.prisma.product.create({
      data: {
        barcode,
        name: body.name,
        model: body.model || null,
        categoryId: body.categoryId,
        purchasePrice: body.purchasePrice,
        sellingPrice: body.sellingPrice,
        quantity: body.quantity,
        image: body.image || null,
      },
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      model?: string;
      categoryId?: string;
      purchasePrice?: number;
      sellingPrice?: number;
      quantity?: number;
      image?: string;
    },
  ) {
    return this.prisma.product.update({
      where: { id },
      data: body,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
