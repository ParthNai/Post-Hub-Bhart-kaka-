const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const { roles } = require("../config/roles");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    mobile: {
      type: Number,
      required: false,
    },
    role: {
      type: String,
      enum: roles,
      default: "user",
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
      minlength: 8,
      default: null,
    },
    pin: {
      type: String,
      required: false,
      minlength: 4,
      maxlength: 4,

      default: null,
    },
      occupation: {
      type: String,
      required: false,

      default: null,
    },
    village: {
      type: String,
      required: false,

      default: null,
    },
    taluka: {
      type: String,
      required: false,

      default: null,
    },
    district: {
      type: String,
      required: false,

      default: null,
    },
    otp: {
      type: Number,
      required: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
    activeBusinessId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "userbusinesses",
      required: false,
    },
    userType: {
      type: String,
      required: false,
      default: "panchayat",
    },
    subscription: {
      type: Object,
      required: false,
    },
    downloadLimit: {
      type: Number,
      default: 9,
    },
    todayDownloadCount: {
      type: Number,
      default: 0,
    },
    lastLoginDate: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

const User = mongoose.model("User", userSchema);

module.exports = User;
