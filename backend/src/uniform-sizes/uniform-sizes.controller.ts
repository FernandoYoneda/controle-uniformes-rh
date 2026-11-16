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

import { UniformSizesService } from './uniform-sizes.service';
import { CreateUniformSizeDto } from './dto/create-uniform-size.dto';
import { UpdateUniformSizeDto } from './dto/update-uniform-size.dto';

@Controller('uniform-sizes')
export class UniformSizesController {
  constructor(
    private readonly uniformSizesService: UniformSizesService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateUniformSizeDto) {
    return this.uniformSizesService.create(dto);
  }

  @Get()
  findAll() {
    return this.uniformSizesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.uniformSizesService.findOne(id);
  }

  @Patch(':id/activate')
  @Roles(UserRole.ADMIN)
  activate(@Param('id', ParseUUIDPipe) id: string) {
    return this.uniformSizesService.activate(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUniformSizeDto,
  ) {
    return this.uniformSizesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.uniformSizesService.remove(id);
  }
}
