const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const themeSampleSchema = mongoose.Schema(
  {
    themeSampleImage: {
      type: String,
      required: false
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
themeSampleSchema.plugin(toJSON);
themeSampleSchema.plugin(paginate);

const ThemeSample = mongoose.model('ThemeSample', themeSampleSchema);

module.exports = ThemeSample;
