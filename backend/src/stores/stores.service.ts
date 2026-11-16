import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStoreDto: CreateStoreDto) {
    const number = createStoreDto.number.trim();
    const name = createStoreDto.name.trim();

    if (!number || !name) {
      throw new BadRequestException('Número e nome da loja são obrigatórios.');
    }

    const existingStore = await this.prisma.store.findUnique({
      where: { number },
    });

    if (existingStore) {
      throw new ConflictException(
        'Já existe uma loja cadastrada com esse número.',
      );
    }

    return this.prisma.store.create({
      data: {
        number,
        name,
      },
    });
  }

  async findAll() {
    return this.prisma.store.findMany({
      orderBy: {
        number: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const store = await this.prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      throw new NotFoundException('Loja não encontrada.');
    }

    return store;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    await this.findOne(id);

    const data: {
      number?: string;
      name?: string;
    } = {};

    if (updateStoreDto.number !== undefined) {
      const number = updateStoreDto.number.trim();

      if (!number) {
        throw new BadRequestException('O número da loja não pode ficar vazio.');
      }

      const existingStore = await this.prisma.store.findUnique({
        where: { number },
      });

      if (existingStore && existingStore.id !== id) {
        throw new ConflictException(
          'Já existe uma loja cadastrada com esse número.',
        );
      }

      data.number = number;
    }

    if (updateStoreDto.name !== undefined) {
      const name = updateStoreDto.name.trim();

      if (!name) {
        throw new BadRequestException('O nome da loja não pode ficar vazio.');
      }

      data.name = name;
    }

    return this.prisma.store.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.store.update({
      where: { id },
      data: { active: false },
    });
  }

  async activate(id: string) {
    await this.findOne(id);

    return this.prisma.store.update({
      where: { id },
      data: { active: true },
    });
  }
}
