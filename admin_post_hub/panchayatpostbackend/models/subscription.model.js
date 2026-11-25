const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const subscriptionSchema = mongoose.Schema(
  {
    subscriptionName: {
      type: String,
      required: true,
    },
    subscriptionAmount: {
      type: Number,
      required: true,
    },
    subscriptionDuration: {
      type: Number,
      required: true,
    },
    subscriptionType: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
subscriptionSchema.plugin(toJSON);
subscriptionSchema.plugin(paginate);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
