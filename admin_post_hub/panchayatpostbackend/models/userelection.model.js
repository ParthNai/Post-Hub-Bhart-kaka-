const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userElectionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    candidateName: {
      type: String,
      required: false,
    },
    candidateSymbol: {
      type: String,
      required: false,
    },
    candidateSymbolName: {
      type: String,
      required: false,
    },
    candidateNumber: {
      type: Number,
      required: false,
      default: 0,
    },
    candidateMobile: {
      type: Number,
      required: false,
      default: 0,
    },
    candidateLocation: {
      type: String,
      required: false,
    },
    candidateOccupation: {
      type: String,
      required: false,
    },
    candidateImage: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userElectionSchema.plugin(toJSON);
userElectionSchema.plugin(paginate);

const UserElection = mongoose.model('UserElection', userElectionSchema);

module.exports = UserElection;
