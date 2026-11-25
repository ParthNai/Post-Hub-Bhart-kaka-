import { Module } from '@nestjs/common';
import { GramMahitiService } from './grammahiti.service';
import { GramMahitiController } from './grammahiti.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GramMahiti, GramMahitiSchema } from './schema/grammahiti.schema';
import {
  TableSection,
  TableSectionSchema,
} from '../tablesection/schema/tablesection.schema';
import {
  TableHeader,
  TableHeaderSchema,
} from '../tableheader/schema/tableheader.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GramMahiti.name, schema: GramMahitiSchema },
      { name: TableSection.name, schema: TableSectionSchema },
      { name: TableHeader.name, schema: TableHeaderSchema },
    ]),
  ],
  controllers: [GramMahitiController],
  providers: [GramMahitiService],
})
export class GramMahitiModule {}
