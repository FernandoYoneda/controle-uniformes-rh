import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  private parseDate(value: string, field: string): Date {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new BadRequestException(
        `${field} deve estar no formato YYYY-MM-DD.`,
      );
    }

    const date = new Date(`${value}T00:00:00.000Z`);

    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== value
    ) {
      throw new BadRequestException(`${field} inválida.`);
    }

    return date;
  }

  private async validateStore(storeId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException('Loja não encontrada.');
    }

    if (!store.active) {
      throw new BadRequestException(
        'Não é permitido vincular funcionários a lojas inativas.',
      );
    }
  }

  private async validateRegistration(registration: string, currentId?: string) {
    const existing = await this.prisma.employee.findUnique({
      where: { registration },
    });

    if (existing && existing.id !== currentId) {
      throw new ConflictException(
        'Já existe um funcionário com essa matrícula.',
      );
    }
  }

  async create(dto: CreateEmployeeDto) {
    const registration = dto.registration.trim();
    const name = dto.name.trim();

    if (!registration || !name) {
      throw new BadRequestException('Matrícula e nome são obrigatórios.');
    }

    await this.validateRegistration(registration);
    await this.validateStore(dto.storeId);

    return this.prisma.employee.create({
      data: {
        registration,
        name,
        hireDate: this.parseDate(dto.hireDate, 'Data de admissão'),
        storeId: dto.storeId,
      },
      include: { store: true },
    });
  }

  async findAll() {
    return this.prisma.employee.findMany({
      include: { store: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: { store: true },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    return employee;
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    const employee = await this.findOne(id);

    const data: {
      registration?: string;
      name?: string;
      hireDate?: Date;
      storeId?: string;
      dismissalDate?: Date;
    } = {};

    if (dto.registration !== undefined) {
      const registration = dto.registration.trim();

      if (!registration) {
        throw new BadRequestException('A matrícula não pode ficar vazia.');
      }

      await this.validateRegistration(registration, id);
      data.registration = registration;
    }

    if (dto.name !== undefined) {
      const name = dto.name.trim();

      if (!name) {
        throw new BadRequestException('O nome não pode ficar vazio.');
      }

      data.name = name;
    }

    if (dto.hireDate !== undefined) {
      data.hireDate = this.parseDate(dto.hireDate, 'Data de admissão');
    }

    if (dto.storeId !== undefined) {
      if (!employee.active) {
        throw new BadRequestException(
          'Não é permitido transferir funcionário inativo.',
        );
      }

      await this.validateStore(dto.storeId);
      data.storeId = dto.storeId;
    }

    if (dto.dismissalDate !== undefined) {
      if (employee.active) {
        throw new BadRequestException('Utilize a operação de desligamento.');
      }

      data.dismissalDate = this.parseDate(
        dto.dismissalDate,
        'Data de desligamento',
      );
    }

    const hireDate = data.hireDate ?? employee.hireDate;
    const dismissalDate = data.dismissalDate ?? employee.dismissalDate;

    if (dismissalDate && dismissalDate < hireDate) {
      throw new BadRequestException(
        'A data de desligamento não pode ser anterior à admissão.',
      );
    }

    return this.prisma.employee.update({
      where: { id },
      data,
      include: { store: true },
    });
  }

  async remove(id: string, dismissalDate: string) {
    const employee = await this.findOne(id);

    if (!employee.active) {
      throw new BadRequestException('Funcionário já está inativo.');
    }

    const date = this.parseDate(dismissalDate, 'Data de desligamento');

    if (date < employee.hireDate) {
      throw new BadRequestException(
        'A data de desligamento não pode ser anterior à admissão.',
      );
    }

    return this.prisma.employee.update({
      where: { id },
      data: {
        active: false,
        dismissalDate: date,
      },
      include: { store: true },
    });
  }

  async activate(id: string) {
    await this.findOne(id);

    return this.prisma.employee.update({
      where: { id },
      data: {
        active: true,
        dismissalDate: null,
      },
      include: { store: true },
    });
  }
}
