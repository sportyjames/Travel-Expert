const express = require('express');
const router = express.Router();
const faq = require('../controllers/faq');

router.get('/', faq.index);

module.exports = router;