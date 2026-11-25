const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const customcategorySchema = mongoose.Schema(
  {
    customcategoryName: {
      type: String,
      required: true,
    },
    customcategoryImage: {
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
customcategorySchema.plugin(toJSON);
customcategorySchema.plugin(paginate);

const Customcategory = mongoose.model('Customcategory', customcategorySchema);

module.exports = Customcategory;
