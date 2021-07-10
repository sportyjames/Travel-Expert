const express = require('express');
const router = express.Router();
const picture = require('../controllers/picture');
const catchAsync = require('../utils/catchAsync');



//set a default city if user tries to skip typing the city at home page
router.get('/', catchAsync(picture.index))

router.post('/', catchAsync(picture.fetchPicture))

module.exports = router;