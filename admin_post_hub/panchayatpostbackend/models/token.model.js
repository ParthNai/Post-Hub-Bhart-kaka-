const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);
tokenSchema.plugin(paginate);

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
