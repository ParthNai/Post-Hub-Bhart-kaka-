const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const sliderSchema = mongoose.Schema(
  {
    sliderName: {
      type: String,
      required: false,
    },
    sliderLink: {
      type: String,
      required: false,
    },
    sliderImage: {
      type: String,
      required: false
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
sliderSchema.plugin(toJSON);
sliderSchema.plugin(paginate);

const Slider = mongoose.model('Slider', sliderSchema);

module.exports = Slider;
