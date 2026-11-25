const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userBusinessSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    businessName: {
      type: String,
      required: false,
    },
    businessTagLine: {
      type: String,
      required: false,
    },
    businessEmail: {
      type: String,
      required: false,
    },
    businessMobile: {
      type: Number,
      required: false,
    },
    businessWebsite: {
      type: String,
      required: false,
    },
    businessAddress: {
      type: String,
      required: false,
    },
    businessLogo: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userBusinessSchema.plugin(toJSON);
userBusinessSchema.plugin(paginate);

const UserBusiness = mongoose.model('UserBusiness', userBusinessSchema);

module.exports = UserBusiness;
