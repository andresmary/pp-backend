import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/users.schema';
import { CreateUsersDto } from './dto/create-users.dto';
import { IUsers } from './interface/users.interface';

@Injectable()
export class UsersService {
  @InjectModel(User.name) private model: Model<IUsers>;

  async createUser(createUsersDto: CreateUsersDto): Promise<IUsers> {
    const newUser = await new this.model(createUsersDto);
    const availableUser = await this.model.find({
      name: newUser.name,
    });
    if (availableUser && availableUser[0]?.name === createUsersDto.name) {
      throw new ForbiddenException('User not available!');
    }
    return newUser.save();
  }

  async getAllUsers(): Promise<IUsers[]> {
    const usersData = await this.model.find();
    if (!usersData || usersData.length == 0) {
      throw new NotFoundException('Users data not found!');
    }
    return usersData;
  }

  async getUser(userId: string): Promise<IUsers> {
    const existingUser = await this.model.findById(userId);
    return existingUser;
  }

  async deleteUser(userId: string): Promise<IUsers> {
    const deletedUser = await this.model.findByIdAndRemove(userId);
    return deletedUser;
  }
}
