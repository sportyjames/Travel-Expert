const express = require('express');
const router = express.Router();
const about = require('../controllers/about');

router.get('/', about.index);

module.exports = router;