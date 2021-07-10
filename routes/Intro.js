const express = require('express');
const router = express.Router();
const Intro = require('../controllers/Intro');

router.get('/', Intro.index);

module.exports = router;