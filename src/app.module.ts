import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TablesModule } from './tables/tables.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://andresmary:Mongodb4ndr3s@test-pp.wb024w6.mongodb.net/',
      { dbName: 'gameDB' },
    ),
    TablesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
