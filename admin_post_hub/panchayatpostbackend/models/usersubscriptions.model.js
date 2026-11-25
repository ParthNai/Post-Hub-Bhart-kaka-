const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userSubscriptionSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'users',
            required: true,
        },
        orderId: {
            type: String,
            required: true
        },
        paymentId: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true,
        },
        mobile: {
            type: Number,
            required: true
        },
        subscriptionId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'subscriptions',
            required: true,
        },
        startDate: {
            type: Date,
            require: true
        },
        endDate: {
            type: Date,
            require: true
        }
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
userSubscriptionSchema.plugin(toJSON);
userSubscriptionSchema.plugin(paginate);


/**
 * @typedef userSubscription
 */
const userSubscription = mongoose.model('userSubscription', userSubscriptionSchema);

module.exports = userSubscription;
