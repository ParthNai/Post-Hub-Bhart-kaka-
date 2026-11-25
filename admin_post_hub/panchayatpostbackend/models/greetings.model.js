const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const greetingSchema = mongoose.Schema(
  {
    greetingName: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true
    },
    isHomePage: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
greetingSchema.plugin(toJSON);
greetingSchema.plugin(paginate);

const Greeting = mongoose.model('Greeting', greetingSchema);

module.exports = Greeting;
