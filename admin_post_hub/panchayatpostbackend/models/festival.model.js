const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const festivalSchema = mongoose.Schema(
  {
    festivalName: {
      type: String,
      required: true,
    },
    isFixedDate: {
      type: Boolean,
      required: false,
      default: false
    },
    festivalDate: {
      type: Date,
      required: false
    },
    festivalDescription: {
      type: String,
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
festivalSchema.plugin(toJSON);
festivalSchema.plugin(paginate);

const Festival = mongoose.model('Festival', festivalSchema);

module.exports = Festival;
