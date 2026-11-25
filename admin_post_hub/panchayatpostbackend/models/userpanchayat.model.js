const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userGrampanchayatSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    panchayatName: {
      type: String,
      required: false,
    },
    panchayatLogo: {
      type: String,
      required: false,
    },
    personImage: {
      type: String,
      required: false,
    },
    personName: {
      type: String,
      required: false,
    },
    panchayatOccupation: {
      type: String,
      required: false,
    },
    panchayatMobile: {
      type: Number,
      required: false,
    },
    panchayatAddress: {
      type: String,
      required: false,
    },
    panchayatWebsite: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userGrampanchayatSchema.plugin(toJSON);
userGrampanchayatSchema.plugin(paginate);

const UserGrampanchayat = mongoose.model('UserGrampanchayat', userGrampanchayatSchema);

module.exports = UserGrampanchayat;
