const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const festivalPostSchema = mongoose.Schema(
  {
    postName: {
      type: String,
      required: false,
    },
    postStartDate: {
      type: Date,
      required: true,
    },
    postEndDate: {
      type: Date,
      required: true,
    },
    festivalId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "festivals",
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
festivalPostSchema.plugin(toJSON);
festivalPostSchema.plugin(paginate);

const FestivalPost = mongoose.model("FestivalPost", festivalPostSchema);

module.exports = FestivalPost;
