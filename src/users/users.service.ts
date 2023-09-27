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
import { Table } from 'src/tables/schemas/tables.schema';
import { ITables } from 'src/tables/interface/tables.interface';

@Injectable()
export class UsersService {
  @InjectModel(User.name) private model: Model<IUsers>;
  @InjectModel(Table.name) private tableModel: Model<ITables>;

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
    const isUserInTable = await this.tableModel.find({
      votes: { $elemMatch: { userId: userId } },
    });
    if (isUserInTable) {
      isUserInTable.map(async (table) => {
        await this.tableModel.updateOne(
          { _id: table._id },
          {
            $pull: { votes: { userId: userId } },
          },
          { safe: true, multi: false },
        );
      });
    }
    const deletedUser = await this.model.findByIdAndRemove(userId);
    if (!deletedUser) {
      throw new NotFoundException('User not found!');
    }
    return deletedUser;
  }
}
