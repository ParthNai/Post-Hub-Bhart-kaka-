const express = require('express');
const { userProfile } = require('../../controllers/user')
const upload = require('../../multer')

const router = express.Router();

// function delay(req, res, next) {
//     setTimeout(() => {
//         next()
//     }, 2000)
// }

router.post('/updateprofile', userProfile.updateProfile)
router.get('/verifydownload', userProfile.verifyDownload)
router.get('/incrementdownload', userProfile.incrementDownload)

module.exports = router;
