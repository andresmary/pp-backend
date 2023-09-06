import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/users.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post()
  create(@Body() data: User) {
    return this.userService.create(data);
  }
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  @Patch('/:id')
  update(@Param('id') id: string, @Body() data: User) {
    return this.userService.update(id, data);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
