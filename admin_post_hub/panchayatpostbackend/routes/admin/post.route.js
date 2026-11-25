const express = require('express');
const { postController } = require('../../controllers/admin')
const upload = require('../../multer/uploadPostImages')

const router = express.Router();

router.get('/', postController.all)
router.post('/create', upload.any(), postController.create)
router.put('/update', upload.any(), postController.update)
router.delete('/delete', postController.remove)
router.get('/festivalpost', postController.festivalPost)
router.post('/createfestivalpost', postController.createFestivalPost)
router.put('/updatefestivalpost', postController.updateFestivalPost)
router.get('/deletefestivalpost', postController.removeFestivalPost)


module.exports = router;
