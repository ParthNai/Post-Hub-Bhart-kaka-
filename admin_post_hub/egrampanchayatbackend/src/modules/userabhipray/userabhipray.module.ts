import { Module } from '@nestjs/common';
import { UserAbhiprayService } from './userabhipray.service';
import { UserAbhiprayController } from './userabhipray.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAbhipray, UserAbhipraySchema } from './schema/userabhipray.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserAbhipray.name, schema: UserAbhipraySchema },
    ]),
  ],
  controllers: [UserAbhiprayController],
  providers: [UserAbhiprayService],
})
export class UserAbhiprayModule {}
