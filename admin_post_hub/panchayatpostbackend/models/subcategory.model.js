const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const subcategorySchema = mongoose.Schema(
  {
    categoryId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'categories',
      required: true,
    },
    subcategoryName: {
      type: String,
      required: true,
    },
    subcategoryImage: {
      type: String,
      required: false,
    },
    priority: {
      type: Number,
      required: false
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
subcategorySchema.plugin(toJSON);
subcategorySchema.plugin(paginate);

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = Subcategory;
