import { Module } from '@nestjs/common';
import { TableHeaderService } from './tableheader.service';
import { TableHeaderController } from './tableheader.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TableHeader, TableHeaderSchema } from './schema/tableheader.schema';
import {
  Panchayat,
  PanchayatSchema,
} from 'src/panchayat/schema/panchayat.schema';
import {
  TableSection,
  TableSectionSchema,
} from '../tablesection/schema/tablesection.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TableHeader.name, schema: TableHeaderSchema },
      { name: Panchayat.name, schema: PanchayatSchema },
      { name: TableSection.name, schema: TableSectionSchema },
    ]),
  ],
  controllers: [TableHeaderController],
  providers: [TableHeaderService],
})
export class TableHeaderModule {}
