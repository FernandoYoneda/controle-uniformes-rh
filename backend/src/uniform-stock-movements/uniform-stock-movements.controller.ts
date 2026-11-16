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

import { UniformStockMovementsService } from './uniform-stock-movements.service';

import { CreateUniformStockMovementDto } from './dto/create-uniform-stock-movement.dto';

import { UpdateUniformStockMovementDto } from './dto/update-uniform-stock-movement.dto';

@Controller('uniform-stock-movements')
export class UniformStockMovementsController {
  constructor(
    private readonly uniformStockMovementsService: UniformStockMovementsService,
  ) {}

  @Post()
  create(
    @Body()
    createUniformStockMovementDto: CreateUniformStockMovementDto,
  ) {
    return this.uniformStockMovementsService.create(
      createUniformStockMovementDto,
    );
  }

  @Get()
  findAll() {
    return this.uniformStockMovementsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.uniformStockMovementsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body()
    updateUniformStockMovementDto: UpdateUniformStockMovementDto,
  ) {
    return this.uniformStockMovementsService.update(
      id,
      updateUniformStockMovementDto,
    );
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.uniformStockMovementsService.remove(id);
  }
}
