require("dotenv").config()
const express = require("express");
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const app = express();
const cors = require("cors");
const compression = require('compression');
const AdminRoutes = require('./routes/admin');
const UserRoutes = require('./routes/user');
const path = require('path');
const config = require('./config/config');
const morgan = require('./config/morgan');
const httpStatus = require("http-status");
const { rateLimiter } = require('./middlewares/rateLimiter');
const cron = require('node-cron');
const { sendFestivalNotification } = require("./services/user/notification.service");


if (config.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}


app.use(cors());
app.options('*', cors());

app.use(express.static(path.join(__dirname, '/')));
app.use('/uploaded', express.static(path.join(__dirname, 'uploaded')));
app.use('/uploaded', express.static(path.join(__dirname, '..', 'uploaded')));

app.use(helmet());

// parse json request body
app.use(express.json({ limit: '50mb' }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());


app.use('/adminapi', rateLimiter, AdminRoutes)

app.use('/api', rateLimiter, UserRoutes)

app.locals.moment = require('moment');
global.ObjectId = require('mongodb').ObjectID;


// for testing every 10 sec */10 * * * * *


// for production every day at 7 am

cron.schedule('0 7 * * *', async () => {
    await sendFestivalNotification()
});

app.use(function (req, res, next) {
    next(
        res.status(httpStatus.NOT_FOUND).send({ message: "Internal Server Error" })
    );
});

module.exports = app;