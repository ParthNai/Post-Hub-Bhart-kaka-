import { Module } from '@nestjs/common';
import { ImportantLinkService } from './importantlink.service';
import { ImportantLinkController } from './importantlink.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ImportantLink,
  ImportantLinkSchema,
} from './schema/importantlink.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImportantLink.name, schema: ImportantLinkSchema },
    ]),
  ],
  controllers: [ImportantLinkController],
  providers: [ImportantLinkService],
})
export class ImportantLinkModule {}
