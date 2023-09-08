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

@Injectable()
export class TablesService {
  @InjectModel(Table.name) private model: Model<ITables>;

  async createTable(createTablesDto: CreateTablesDto): Promise<ITables> {
    const newTable = await new this.model(createTablesDto);
    const availableTable = await this.model.find({
      table: newTable.table,
    });
    if (availableTable && availableTable[0]?.table === createTablesDto.table) {
      throw new ForbiddenException('Table name not available!');
    }
    return newTable.save();
  }

  async getAllTables(): Promise<ITables[]> {
    const tablesData = await this.model.find();
    if (!tablesData || tablesData.length == 0) {
      throw new NotFoundException('Tables data not found!');
    }
    return tablesData;
  }

  async getTable(id: string): Promise<ITables> {
    const existingTable = await this.model.findById(id);
    return existingTable;
  }

  async clearTableVotes(tableId: string): Promise<ITables> {
    await this.model.updateOne(
      { _id: tableId },
      {
        $set: { 'votes.$[].vote': 0 },
      },
    );
    const existingTableVotes = await this.model.findById(tableId);
    return existingTableVotes;
  }

  async updateTableVote(
    tableId: string,
    userId: string,
    value: number,
  ): Promise<ITables> {
    await this.model.updateOne(
      { _id: tableId, 'votes.userId': userId },
      {
        $set: { 'votes.$.vote': value },
      },
    );
    const existingTableVotes = await this.model.findById(tableId);
    return existingTableVotes;
  }

  async deleteTable(id: string): Promise<ITables> {
    const deletedTable = await this.model.findByIdAndRemove(id);
    return deletedTable;
  }
}
