import { Module } from '@nestjs/common';
import { SliderService } from './slider.service';
import { SliderController } from './slider.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Slider, SliderSchema } from './schema/slider.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Slider.name, schema: SliderSchema }]),
  ],
  controllers: [SliderController],
  providers: [SliderService],
})
export class SliderModule {}
