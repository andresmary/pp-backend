import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TablesService } from './tables.service';
import { Table } from './schemas/tables.schema';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}
  @Post()
  create(@Body() data: Table) {
    return this.tablesService.create(data);
  }
  @Get()
  findAll() {
    return this.tablesService.findAll();
  }
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(id);
  }
  @Patch('/:id')
  update(@Param('id') id: string, @Body() data: Table) {
    return this.tablesService.update(id, data);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tablesService.delete(id);
  }
}
