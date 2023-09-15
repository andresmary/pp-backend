import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Table } from './schemas/tables.schema';
import { CreateTablesDto } from './dto/create-tables.dto';
import { ITables } from './interface/tables.interface';
import { User } from 'src/users/schemas/users.schema';
import { IUsers } from 'src/users/interface/users.interface';

@Injectable()
export class TablesService {
  @InjectModel(Table.name) private model: Model<ITables>;
  @InjectModel(User.name) private userModel: Model<IUsers>;

  async createTable(createTablesDto: CreateTablesDto): Promise<ITables> {
    const nameExists = await this.model.find({
      table: createTablesDto.table,
    });
    if (!!nameExists.length) {
      throw new ForbiddenException('Table name not available!');
    } else {
      const newTable = await new this.model(createTablesDto);
      return newTable.save();
    }
  }

  async getAllTables(): Promise<ITables[]> {
    const tablesData = await this.model.find();
    if (!tablesData || tablesData.length == 0) {
      throw new NotFoundException('Tables data not found!');
    }
    return tablesData;
  }

  async getTable(tableId: string): Promise<ITables> {
    const existingTable = await this.model.findById(tableId);
    return existingTable;
  }

  async addTableUser(tableId: string, userId: string): Promise<ITables> {
    const userExists = await this.userModel.exists({ _id: userId });
    if (!!userExists) {
      await this.model.updateOne(
        { _id: tableId },
        {
          $addToSet: { votes: [{ vote: 0, userId: userId }] },
        },
        { new: true },
      );
    } else {
      throw new NotFoundException('User data not found!');
    }
    const tableData = await this.model.findById(tableId);
    return tableData;
  }

  async removeTableUser(tableId: string, userId: string): Promise<ITables> {
    const isUserInTable = await this.model.findOne(
      { _id: tableId },
      { votes: { $elemMatch: { userId: userId } } },
    );
    if (!!isUserInTable.votes.length) {
      await this.model.updateOne(
        { _id: tableId },
        {
          $pull: { votes: { userId: userId } },
        },
        { safe: true, multi: false },
      );
    } else {
      throw new NotFoundException('User in table not found!');
    }
    const existingTableVotes = await this.model.findById(tableId);
    return existingTableVotes;
  }

  async clearTableVotes(tableId: string): Promise<ITables> {
    const existingTable = await this.model.findById(tableId);
    if (existingTable) {
      await this.model.updateOne(
        { _id: tableId },
        {
          $set: { 'votes.$[].vote': 0 },
        },
      );
    } else {
      throw new NotFoundException('Table not found!');
    }
    const tableData = await this.model.findById(tableId);
    return tableData;
  }

  async updateTableVote(
    tableId: string,
    userId: string,
    value: number,
  ): Promise<ITables> {
    const existingTable = await this.model.findById(tableId);
    const isUserInTable = await this.model.findOne(
      { _id: tableId },
      { votes: { $elemMatch: { userId: userId } } },
    );
    if (existingTable && isUserInTable.votes.length) {
      await this.model.updateOne(
        { _id: tableId, 'votes.userId': userId },
        {
          $set: { 'votes.$.vote': value },
        },
      );
    } else {
      throw new NotFoundException('Table or user not found!');
    }
    const tableData = await this.model.findById(tableId);
    return tableData;
  }

  async deleteTable(tableId: string): Promise<ITables> {
    const deletedTable = await this.model.findByIdAndRemove(tableId);
    return deletedTable;
  }
}
