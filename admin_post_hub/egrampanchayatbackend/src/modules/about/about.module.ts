import { Module } from '@nestjs/common';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { About, AboutSchema } from './schema/about.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: About.name, schema: AboutSchema }]),
  ],
  controllers: [AboutController],
  providers: [AboutService],
})
export class AboutModule {}
