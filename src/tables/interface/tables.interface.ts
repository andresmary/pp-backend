import { Document } from 'mongoose';

export interface ITables extends Document {
  readonly table: string;
  readonly votes: Array<{
    readonly vote: number;
    readonly userId: string;
  }>;
}
