import { Module } from '@nestjs/common';
import { ContactRequestService } from './contactrequest.service';
import { ContactRequestController } from './contactrequest.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ContactRequest,
  ContactRequestSchema,
} from './schema/contactrequest.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContactRequest.name, schema: ContactRequestSchema },
    ]),
  ],
  controllers: [ContactRequestController],
  providers: [ContactRequestService],
})
export class ContactRequestModule {}
