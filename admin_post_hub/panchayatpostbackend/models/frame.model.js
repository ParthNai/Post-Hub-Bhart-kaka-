const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const frameSchema = mongoose.Schema(
  {
    frameName: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    regions: {
      type: Array,
      required: true,
    },
    isElection: {
      type: Boolean,
      default: false,
    },
    imageHeight: {
      type: Number,
      required: true,
    },

    imageWidth: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
frameSchema.plugin(toJSON);
frameSchema.plugin(paginate);

const Frame = mongoose.model("Frame", frameSchema);

module.exports = Frame;
