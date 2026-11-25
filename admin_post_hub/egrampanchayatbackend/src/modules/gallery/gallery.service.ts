import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AllGalleryQueryDto,
  CreateGalleryDto,
  GalleryQueryDto,
  UpdateGalleryDto,
} from './dto/gallery.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Gallery } from './schema/gallery.schema';
import { Model } from 'mongoose';
import { getPaginatedResponse } from 'src/utils/getPaginatedResponse';
import { breakdownArrays } from 'src/utils/array.utils';
import { removeFileSync } from 'src/utils/removeFileSync';

@Injectable()
export class GalleryService {
  constructor(@InjectModel(Gallery.name) private gallery: Model<Gallery>) {}
  async create(createGalleryDto: CreateGalleryDto) {
    try {
      return await this.gallery.create(createGalleryDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: GalleryQueryDto) {
    const findGallery = await this.gallery.findOne(galleryQuery(Query));
    if (!findGallery) {
      await this.gallery.create({
        images: [],
        panchayatId: Query.panchayatId,
        createdBy: 'admin',
      });
    }

    if (Query.panchayatId) {
      return await this.gallery.findOne({ panchayatId: Query.panchayatId });
    } else {
      return await this.gallery.findOne({ panchayatId: { $exists: false } });
    }
  }

  async findAll(Query: AllGalleryQueryDto) {
    return await this.gallery.find(galleryQuery(Query));
  }

  async findOne(id: string) {
    return await this.gallery.findById(id);
  }

  async update(updateGalleryDto: UpdateGalleryDto) {
    const findGallery = await this.gallery.findById(updateGalleryDto._id);

    const diff = breakdownArrays(updateGalleryDto.deletedImages, [
      ...updateGalleryDto.images,
      ...findGallery.images,
    ]);
    diff.existing.map((d) => removeFileSync(d));

    //
    return await this.gallery
      .findByIdAndUpdate(updateGalleryDto._id, {
        images: diff.new,
      })
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.gallery.findByIdAndDelete(id);
  }
}

const galleryQuery = ({ panchayatId }: GalleryQueryDto) => {
  let query = {};

  if (panchayatId) {
    query = {
      ...query,

      panchayatId: panchayatId,
    };
  }

  return query;
};
