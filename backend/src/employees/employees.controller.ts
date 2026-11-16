import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { IsDateString } from 'class-validator';

import { UserRole } from '../../generated/prisma/enums';
import { Roles } from '../auth/decorators/roles.decorator';

import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

class DismissEmployeeDto {
  @IsDateString()
  dismissalDate: string;
}

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.RH)
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeesService.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.RH)
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.RH)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.RH)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, dto);
  }

  @Patch(':id/activate')
  @Roles(UserRole.ADMIN, UserRole.RH)
  activate(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.activate(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.RH)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DismissEmployeeDto,
  ) {
    return this.employeesService.remove(id, dto.dismissalDate);
  }
}
