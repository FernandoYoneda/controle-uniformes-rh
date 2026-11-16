import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import {
  UniformMovementType,
  UniformMovementStatus,
} from '../../generated/prisma/client';

import { CreateUniformStockMovementDto } from './dto/create-uniform-stock-movement.dto';
import { UpdateUniformStockMovementDto } from './dto/update-uniform-stock-movement.dto';

@Injectable()
export class UniformStockMovementsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly includeRelations = {
    variant: {
      include: {
        product: true,
        size: true,
      },
    },
    employee: {
      include: {
        store: true,
      },
    },
  };

  async create(dto: CreateUniformStockMovementDto) {
    const variant = await this.prisma.uniformVariant.findUnique({
      where: { id: dto.variantId },
      include: {
        product: true,
        size: true,
      },
    });

    if (!variant) {
      throw new NotFoundException('Produto e tamanho não encontrados.');
    }

    if (!variant.active || !variant.product.active || !variant.size.active) {
      throw new BadRequestException('O produto ou tamanho está inativo.');
    }

    if (
      dto.type === UniformMovementType.DELIVERY ||
      dto.type === UniformMovementType.RETURN
    ) {
      if (!dto.employeeId) {
        throw new BadRequestException(
          'É obrigatório informar o funcionário para entregas e devoluções.',
        );
      }
    }

    if (dto.employeeId) {
      const employee = await this.prisma.employee.findUnique({
        where: { id: dto.employeeId },
      });

      if (!employee) {
        throw new NotFoundException('Funcionário não encontrado.');
      }

      if (!employee.active && dto.type === UniformMovementType.DELIVERY) {
        throw new BadRequestException(
          'Não é permitido entregar uniformes a funcionários inativos.',
        );
      }
    }

    if (
      dto.type === UniformMovementType.PURCHASE &&
      dto.unitCost === undefined
    ) {
      throw new BadRequestException(
        'O custo unitário é obrigatório para entradas de compra.',
      );
    }

    return this.prisma.uniformStockMovement.create({
      data: {
        variantId: dto.variantId,
        employeeId: dto.employeeId,
        type: dto.type,
        condition: dto.condition,
        quantity: dto.quantity,
        unitCost: dto.unitCost,
        notes: dto.notes,
        status: UniformMovementStatus.PENDING,
      },
      include: this.includeRelations,
    });
  }

  async findAll() {
    return this.prisma.uniformStockMovement.findMany({
      include: this.includeRelations,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const movement = await this.prisma.uniformStockMovement.findUnique({
      where: { id },
      include: this.includeRelations,
    });

    if (!movement) {
      throw new NotFoundException('Movimentação não encontrada.');
    }

    return movement;
  }

  async update(id: string, dto: UpdateUniformStockMovementDto) {
    const movement = await this.findOne(id);

    if (movement.status !== UniformMovementStatus.PENDING) {
      throw new BadRequestException(
        'Somente movimentações pendentes podem ser editadas.',
      );
    }

    return this.prisma.uniformStockMovement.update({
      where: { id },
      data: {
        notes: dto.notes,
      },
      include: this.includeRelations,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    throw new BadRequestException(
      'Movimentações não podem ser excluídas. O histórico deve ser preservado.',
    );
  }
}
