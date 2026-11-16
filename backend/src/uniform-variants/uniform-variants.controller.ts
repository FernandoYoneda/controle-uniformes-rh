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

import { UniformVariantsService } from './uniform-variants.service';
import { CreateUniformVariantDto } from './dto/create-uniform-variant.dto';
import { UpdateUniformVariantDto } from './dto/update-uniform-variant.dto';

@Controller('uniform-variants')
export class UniformVariantsController {
  constructor(
    private readonly uniformVariantsService: UniformVariantsService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateUniformVariantDto) {
    return this.uniformVariantsService.create(dto);
  }

  @Get()
  findAll() {
    return this.uniformVariantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.uniformVariantsService.findOne(id);
  }

  @Patch(':id/activate')
  @Roles(UserRole.ADMIN)
  activate(@Param('id', ParseUUIDPipe) id: string) {
    return this.uniformVariantsService.activate(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUniformVariantDto,
  ) {
    return this.uniformVariantsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.uniformVariantsService.remove(id);
  }
}
