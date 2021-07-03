const express = require('express');
const router = express.Router();
// const Flightroute = require('../models/flightroute');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, isOwner} = require('../middleware');
const axios = require('axios')


router.post('/', catchAsync(async (req,res) => {
    var city = req.body.cityName;
    const imgApi = await axios.get(`https://api.unsplash.com/search/photos?query=${city}&client_id=TFhu6RR7b5Ts2qtiboVZfSWWNjHsWx0gm12zaQZMr6I`);
    const picture_1 = imgApi['data']['results'][0]['urls'].raw;
    const picture_2 = imgApi['data']['results'][1]['urls'].raw;
    const picture_3 = imgApi['data']['results'][2]['urls'].raw;
    const picture_4 = imgApi['data']['results'][3]['urls'].raw;
    const collection = [city, picture_1, picture_2, picture_3, picture_4];
    // console.log(collection)
    res.render('cityroutes/picture', { collection })
}))

module.exports = router;