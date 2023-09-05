import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Table {
  @Prop({ required: true })
  name: string;

  @Prop()
  votes: Array<{
    vote: number;
    userId: string;
  }>;
}
export const TableSchema = SchemaFactory.createForClass(Table);
