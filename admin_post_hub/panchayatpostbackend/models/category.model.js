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
    categoryType: {
      type: String,
      enum: ['announcement', 'greeting', 'festival', 'general'],
      default: 'greeting'
    },
    showInHero: {
      type: Boolean,
      default: false
    },
    recommendedFrameId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Frame',
      required: false
    },
    permissions: {
      allowPhoto: { type: Boolean, default: true },
      allowName: { type: Boolean, default: true },
      allowMobile: { type: Boolean, default: true },
      allowDesignation: { type: Boolean, default: true },
      allowVillage: { type: Boolean, default: true },
      allowFrames: { type: Boolean, default: true }
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
