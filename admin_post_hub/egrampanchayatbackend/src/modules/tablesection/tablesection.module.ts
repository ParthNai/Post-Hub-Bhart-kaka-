import { Module } from '@nestjs/common';
import { TableSectionService } from './tablesection.service';
import { TableSectionController } from './tablesection.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TableSection, TableSectionSchema } from './schema/tablesection.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TableSection.name, schema: TableSectionSchema },
    ]),
  ],
  controllers: [TableSectionController],
  providers: [TableSectionService],
})
export class TableSectionModule {}
