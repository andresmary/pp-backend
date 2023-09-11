import {
  Res,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Res() response, @Body() createUsersDto: CreateUsersDto) {
    try {
      const newUser = await this.userService.createUser(createUsersDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'User has been created successfully',
        newUser,
      });
    } catch (err) {
      if (err && err.response?.statusCode === 403) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: err.response.statusCode,
          message: err.response.message,
          error: err.response.error,
        });
      } else {
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: 400,
          message: 'Error: User not created!',
          error: 'Bad Request',
        });
      }
    }
  }

  @Get()
  async getAllUsers(@Res() response) {
    try {
      const usersData = await this.userService.getAllUsers();
      return response.status(HttpStatus.OK).json({
        message: 'All users data found successfully',
        usersData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 404,
        message: 'Error: Users not found!',
        error: 'No users',
      });
    }
  }

  @Get('/:id')
  async getUser(@Res() response, @Param('id') id: string) {
    try {
      const existingUser = await this.userService.getUser(id);
      return response.status(HttpStatus.OK).json({
        message: 'User found successfully',
        existingUser,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 404,
        message: 'Error: User not found!',
        error: `No user for id: ${id}`,
      });
    }
  }

  @Delete(':id')
  async deleteUser(@Res() response, @Param('id') id: string) {
    try {
      const deletedUser = await this.userService.deleteUser(id);
      return response.status(HttpStatus.OK).json({
        message: 'User deleted successfully',
        deletedUser,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 404,
        message: 'Error: User not found!',
        error: `No user to be deleted for id: ${id}`,
      });
    }
  }
}
