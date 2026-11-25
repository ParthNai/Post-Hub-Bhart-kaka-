const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const frameFieldsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    isElection: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    variableName: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
frameFieldsSchema.plugin(toJSON);
frameFieldsSchema.plugin(paginate);

const FrameField = mongoose.model("FrameField", frameFieldsSchema);

module.exports = FrameField;
