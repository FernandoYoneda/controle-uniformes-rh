import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUniformSizeDto } from './dto/create-uniform-size.dto';
import { UpdateUniformSizeDto } from './dto/update-uniform-size.dto';

@Injectable()
export class UniformSizesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUniformSizeDto) {
    const name = dto.name.trim().toUpperCase();

    if (!name) {
      throw new BadRequestException('O nome do tamanho é obrigatório.');
    }

    const existingSize = await this.prisma.uniformSize.findUnique({
      where: { name },
    });

    if (existingSize) {
      throw new ConflictException(
        'Já existe um tamanho cadastrado com esse nome.',
      );
    }

    return this.prisma.uniformSize.create({
      data: {
        name,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async findAll() {
    return this.prisma.uniformSize.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(id: string) {
    const size = await this.prisma.uniformSize.findUnique({
      where: { id },
    });

    if (!size) {
      throw new NotFoundException('Tamanho não encontrado.');
    }

    return size;
  }

  async update(id: string, dto: UpdateUniformSizeDto) {
    await this.findOne(id);

    const data: {
      name?: string;
      sortOrder?: number;
    } = {};

    if (dto.name !== undefined) {
      const name = dto.name.trim().toUpperCase();

      if (!name) {
        throw new BadRequestException(
          'O nome do tamanho não pode ficar vazio.',
        );
      }

      const existingSize = await this.prisma.uniformSize.findUnique({
        where: { name },
      });

      if (existingSize && existingSize.id !== id) {
        throw new ConflictException(
          'Já existe um tamanho cadastrado com esse nome.',
        );
      }

      data.name = name;
    }

    if (dto.sortOrder !== undefined) {
      data.sortOrder = dto.sortOrder;
    }

    return this.prisma.uniformSize.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.uniformSize.update({
      where: { id },
      data: {
        active: false,
      },
    });
  }

  async activate(id: string) {
    await this.findOne(id);

    return this.prisma.uniformSize.update({
      where: { id },
      data: {
        active: true,
      },
    });
  }
}
