import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUniformProductDto } from './dto/create-uniform-product.dto';
import { UpdateUniformProductDto } from './dto/update-uniform-product.dto';

@Injectable()
export class UniformProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUniformProductDto) {
    const code = dto.code.trim();
    const name = dto.name.trim();

    if (!code || !name) {
      throw new BadRequestException(
        'Código e nome do produto são obrigatórios.',
      );
    }

    const existingProduct = await this.prisma.uniformProduct.findUnique({
      where: { code },
    });

    if (existingProduct) {
      throw new ConflictException(
        'Já existe um produto cadastrado com esse código.',
      );
    }

    return this.prisma.uniformProduct.create({
      data: {
        code,
        name,
        description: dto.description?.trim() || null,
      },
    });
  }

  async findAll() {
    return this.prisma.uniformProduct.findMany({
      include: {
        variants: {
          include: {
            size: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.uniformProduct.findUnique({
      where: { id },
      include: {
        variants: {
          include: {
            size: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    return product;
  }

  async update(id: string, dto: UpdateUniformProductDto) {
    await this.findOne(id);

    const data: {
      code?: string;
      name?: string;
      description?: string | null;
    } = {};

    if (dto.code !== undefined) {
      const code = dto.code.trim();

      if (!code) {
        throw new BadRequestException(
          'O código do produto não pode ficar vazio.',
        );
      }

      const existingProduct = await this.prisma.uniformProduct.findUnique({
        where: { code },
      });

      if (existingProduct && existingProduct.id !== id) {
        throw new ConflictException(
          'Já existe um produto cadastrado com esse código.',
        );
      }

      data.code = code;
    }

    if (dto.name !== undefined) {
      const name = dto.name.trim();

      if (!name) {
        throw new BadRequestException(
          'O nome do produto não pode ficar vazio.',
        );
      }

      data.name = name;
    }

    if (dto.description !== undefined) {
      data.description = dto.description.trim() || null;
    }

    return this.prisma.uniformProduct.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.uniformProduct.update({
      where: { id },
      data: {
        active: false,
      },
    });
  }

  async activate(id: string) {
    await this.findOne(id);

    return this.prisma.uniformProduct.update({
      where: { id },
      data: {
        active: true,
      },
    });
  }
}
