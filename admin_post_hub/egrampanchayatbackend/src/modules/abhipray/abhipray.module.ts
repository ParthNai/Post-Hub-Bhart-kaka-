import { Module } from '@nestjs/common';
import { AbhiprayService } from './abhipray.service';
import { AbhiprayController } from './abhipray.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Abhipray, AbhipraySchema } from './schema/abhipray.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Abhipray.name, schema: AbhipraySchema },
    ]),
  ],
  controllers: [AbhiprayController],
  providers: [AbhiprayService],
})
export class AbhiprayModule {}
