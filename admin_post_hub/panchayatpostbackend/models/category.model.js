const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const categorySchema = mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    isElection: {
      type: Boolean,
      default: false
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
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
