import { Module } from '@nestjs/common';
import { HeaderService } from './header.service';
import { HeaderController } from './header.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Header, HeaderSchema } from './schema/header.schema';
import { SubHeader, SubHeaderSchema } from './schema/subHeader.schema';
import { SubHeaderController } from './subHeader.controller';
import { SubHeaderService } from './subHeader.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Header.name, schema: HeaderSchema }]),
    MongooseModule.forFeature([
      { name: SubHeader.name, schema: SubHeaderSchema },
    ]),
  ],
  controllers: [HeaderController, SubHeaderController],
  providers: [HeaderService, SubHeaderService],
})
export class HeaderModule {}
