const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const imageSchema = mongoose.Schema(
  {
    categoryId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'categories',
      required: false,
    },
    subcategoryId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'subcategories',
      required: false,
    },
    customcategoryId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'subcategories',
      required: false,
    },
    festivalId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'festivals',
      required: false,
    },
    greetingId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'greetings',
      required: false,
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: false,
    },
    userType: {
      type: String,
      required: false,
    },
    path: {
      type: String,
      required: true,
    },
    thumbPath: {
      type: String,
      required: false,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    recommendedFrameId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Frame',
      required: false,
    },
    showInHero: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
imageSchema.plugin(toJSON);
imageSchema.plugin(paginate);

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
