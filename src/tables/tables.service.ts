import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Table } from './schemas/tables.schema';

@Injectable()
export class TablesService {
  @InjectModel(Table.name) private model: Model<any>;
  create(table: Table) {
    return this.model.create(table);
  }
  findAll() {
    return this.model.find();
  }
  findOne(id: string) {
    return this.model.findById(id);
  }
  update(id: string, table: Table) {
    return this.model.findByIdAndUpdate(id, table, { new: true });
  }
  delete(id: string) {
    return this.model.findByIdAndRemove(id);
  }
}
