import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.category.findMany();
  }

  @Post()
  async create(@Body() body: { name: string; description?: string }) {
    return this.prisma.category.create({
      data: {
        name: body.name,
        description: body.description,
      },
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string },
  ) {
    return this.prisma.category.update({
      where: { id },
      data: body,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
