const express = require('express');
const user = require('./user.route')
const business = require('./business.route')
const category = require('./category.route')
const festival = require('./festival.route')
const auth = require('./auth.route')
const subcategory = require('./subcategory.route')
const customcategory = require('./customcategory.route')
const post = require('./post.route')
const frame = require('./frame.route')
const field = require('./frameFields.route')
const subscription = require('./subscription.route')
const slider = require('./slider.route')
const dashboard = require('./dashboard.route')
const themeSample = require('./themesample.route')
const greeting = require('./greeting.route')
const appControl = require('./appcontrol.route')

const router = express.Router();

router.use('/auth', auth);
router.use('/dashboard', dashboard);
router.use('/users', user)
router.use('/businessess', business)
router.use('/categories', category)
router.use('/subcategories', subcategory)
router.use('/festivals', festival)
router.use('/festival', festival)
router.use('/post', post)
router.use('/frame', frame)
router.use('/frames', frame)
router.use('/framefield', field)
router.use('/framefields', field)
router.use('/subscriptions', subscription)
router.use('/sliders', slider)
router.use('/slider', slider)
router.use('/themesample', themeSample)
router.use('/greetings', greeting)
router.use('/customcategories', customcategory)
router.use('/appcontrol', appControl)


module.exports = router;
