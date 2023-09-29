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
import { ChangeUser, TableId, ChangeVote } from './dto/update-table.dto';

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
      const newTable = await new this.model({
        table: createTablesDto.table,
        votes: [],
      });
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

  async addTableUser(changeUser: ChangeUser): Promise<ITables> {
    const userExists = await this.userModel.findById({
      _id: changeUser.userId,
    });
    // TODO: check that user isn't already in table
    if (!!userExists) {
      await this.model.updateOne(
        { _id: changeUser.tableId },
        {
          $addToSet: {
            votes: [
              { vote: 0, userId: changeUser.userId, userName: userExists.name },
            ],
          },
        },
        { new: true },
      );
    } else {
      throw new NotFoundException('User data not found!');
    }
    const tableData = await this.model.findById(changeUser.tableId);
    return tableData;
  }

  async removeTableUser(changeUser: ChangeUser): Promise<ITables> {
    const isUserInTable = await this.model.findOne(
      { _id: changeUser.tableId },
      { votes: { $elemMatch: { userId: changeUser.userId } } },
    );
    if (!!isUserInTable.votes.length) {
      await this.model.updateOne(
        { _id: changeUser.tableId },
        {
          $pull: { votes: { userId: changeUser.userId } },
        },
        { safe: true, multi: false },
      );
    } else {
      throw new NotFoundException('User in table not found!');
    }
    const existingTableVotes = await this.model.findById(changeUser.tableId);
    return existingTableVotes;
  }

  async clearTableVotes(tableId: TableId): Promise<ITables> {
    const existingTable = await this.model.findById(tableId.tableId);
    if (existingTable) {
      await this.model.updateOne(
        { _id: tableId.tableId },
        {
          $set: { 'votes.$[].vote': 0 },
        },
      );
    } else {
      throw new NotFoundException('Table not found!');
    }
    const tableData = await this.model.findById(tableId.tableId);
    return tableData;
  }

  async updateTableVote(changeVote: ChangeVote): Promise<ITables> {
    const existingTable = await this.model.findById(changeVote.tableId);
    const isUserInTable = await this.model.findOne(
      { _id: changeVote.tableId },
      { votes: { $elemMatch: { userId: changeVote.userId } } },
    );
    if (existingTable && isUserInTable.votes.length) {
      await this.model.updateOne(
        { _id: changeVote.tableId, 'votes.userId': changeVote.userId },
        {
          $set: { 'votes.$.vote': changeVote.value },
        },
      );
    } else {
      throw new NotFoundException('Table or user not found!');
    }
    const tableData = await this.model.findById(changeVote.tableId);
    return tableData;
  }

  async deleteTable(tableId: TableId): Promise<ITables> {
    const deletedTable = await this.model.findByIdAndRemove(tableId.tableId);
    return deletedTable;
  }
}
