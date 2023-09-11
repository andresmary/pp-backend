import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TablesModule } from './tables/tables.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://andresmary:Mongodb4ndr3s@test-pp.wb024w6.mongodb.net/',
      { dbName: 'gameDB' },
    ),
    TablesModule,
    UsersModule,
  ],
})
export class AppModule {}
