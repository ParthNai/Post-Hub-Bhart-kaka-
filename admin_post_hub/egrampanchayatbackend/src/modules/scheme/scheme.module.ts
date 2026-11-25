import { Module } from '@nestjs/common';
import { SchemeCategoryController } from './schemecategory.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SchemeCategory,
  SchemeCategorySchema,
} from './schema/schemecategory.schema';
import { SchemeCategoryService } from './schemecategory.service';
import { Scheme, SchemeSchema } from './schema/scheme.schema';
import { SchemeController } from './scheme.controller';
import { SchemeService } from './scheme.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SchemeCategory.name, schema: SchemeCategorySchema },
      { name: Scheme.name, schema: SchemeSchema },
    ]),
  ],
  controllers: [SchemeCategoryController, SchemeController],
  providers: [SchemeCategoryService, SchemeService],
})
export class SchemeModule {}
