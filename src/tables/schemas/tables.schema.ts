import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Table {
  @Prop({ required: true })
  table: string;

  @Prop(
    raw([
      {
        vote: { type: Number, max: 2 },
        userId: { type: String },
        userName: { type: String },
      },
    ]),
  )
  votes: Array<{
    vote: number;
    userId: string;
    userName: string;
  }>;
}
export const TableSchema = SchemaFactory.createForClass(Table);
