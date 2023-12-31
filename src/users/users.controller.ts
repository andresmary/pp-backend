import {
  Res,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { UserId } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Res() response, @Body() createUsersDto: CreateUsersDto) {
    try {
      const userData = await this.userService.createUser(createUsersDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'User has been created successfully',
        userData,
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

  @Get('/:userId')
  async getUser(@Res() response, @Param('userId') userId: string) {
    try {
      const userData = await this.userService.getUser(userId);
      return response.status(HttpStatus.OK).json({
        message: 'User found successfully',
        userData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 404,
        message: 'Error: User not found!',
        error: `No user for id: ${userId}`,
      });
    }
  }

  @Delete()
  @UsePipes(ValidationPipe)
  async deleteUser(@Res() response, @Body() userId: UserId) {
    try {
      const deletedUser = await this.userService.deleteUser(userId);
      return response.status(HttpStatus.OK).json({
        message: 'User deleted successfully',
        deletedUser,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 404,
        message: 'Error: User not found!',
        error: `No user to be deleted for id: ${userId}`,
      });
    }
  }
}
