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

import { UserRole } from '../../generated/prisma/enums';
import { Roles } from '../auth/decorators/roles.decorator';

import { UniformProductsService } from './uniform-products.service';
import { CreateUniformProductDto } from './dto/create-uniform-product.dto';
import { UpdateUniformProductDto } from './dto/update-uniform-product.dto';

@Controller('uniform-products')
export class UniformProductsController {
  constructor(
    private readonly uniformProductsService: UniformProductsService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateUniformProductDto) {
    return this.uniformProductsService.create(dto);
  }

  @Get()
  findAll() {
    return this.uniformProductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.uniformProductsService.findOne(id);
  }

  @Patch(':id/activate')
  @Roles(UserRole.ADMIN)
  activate(@Param('id', ParseUUIDPipe) id: string) {
    return this.uniformProductsService.activate(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUniformProductDto,
  ) {
    return this.uniformProductsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.uniformProductsService.remove(id);
  }
}
