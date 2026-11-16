import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUniformVariantDto } from './dto/create-uniform-variant.dto';
import { UpdateUniformVariantDto } from './dto/update-uniform-variant.dto';

@Injectable()
export class UniformVariantsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly details = {
    product: true,
    size: true,
  } as const;

  async create(dto: CreateUniformVariantDto) {
    const product = await this.prisma.uniformProduct.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    if (!product.active) {
      throw new BadRequestException(
        'Não é possível associar um produto inativo.',
      );
    }

    const size = await this.prisma.uniformSize.findUnique({
      where: { id: dto.sizeId },
    });

    if (!size) {
      throw new NotFoundException('Tamanho não encontrado.');
    }

    if (!size.active) {
      throw new BadRequestException(
        'Não é possível associar um tamanho inativo.',
      );
    }

    const existingVariant = await this.prisma.uniformVariant.findUnique({
      where: {
        productId_sizeId: {
          productId: dto.productId,
          sizeId: dto.sizeId,
        },
      },
    });

    if (existingVariant) {
      throw new ConflictException(
        'Este produto já possui uma associação com esse tamanho.',
      );
    }

    try {
      return await this.prisma.uniformVariant.create({
        data: {
          productId: dto.productId,
          sizeId: dto.sizeId,
        },
        include: this.details,
      });
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Este produto já possui uma associação com esse tamanho.',
        );
      }

      throw error;
    }
  }

  async findAll() {
    return this.prisma.uniformVariant.findMany({
      include: this.details,
      orderBy: [{ product: { name: 'asc' } }, { size: { sortOrder: 'asc' } }],
    });
  }

  async findOne(id: string) {
    const variant = await this.prisma.uniformVariant.findUnique({
      where: { id },
      include: this.details,
    });

    if (!variant) {
      throw new NotFoundException(
        'Associação de produto e tamanho não encontrada.',
      );
    }

    return variant;
  }

  async update(id: string, dto: UpdateUniformVariantDto) {
    await this.findOne(id);

    if (dto.active === undefined) {
      throw new BadRequestException(
        'Informe o campo active para atualizar a associação.',
      );
    }

    return this.prisma.uniformVariant.update({
      where: { id },
      data: { active: dto.active },
      include: this.details,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.uniformVariant.update({
      where: { id },
      data: { active: false },
      include: this.details,
    });
  }

  async activate(id: string) {
    const variant = await this.findOne(id);

    if (!variant.product.active || !variant.size.active) {
      throw new BadRequestException(
        'O produto e o tamanho precisam estar ativos.',
      );
    }

    return this.prisma.uniformVariant.update({
      where: { id },
      data: { active: true },
      include: this.details,
    });
  }
}
