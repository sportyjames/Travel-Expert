const express = require('express');
const router = express.Router();
const Flightroute = require('../models/flightroute');
const { isLoggedIn } = require('../middleware'); //cannot book new flightroute if not signed in !!!

router.get('/new', (req, res) => {
    res.render('flightroutes/new');
})

//no need to use catchAsync here because user is not entering invalid input here, Just button click
router.post('/', isLoggedIn, async (req,res) => {
    //try to create one and store in db 
    const flightroute = new Flightroute(req.body.flightroute);
    await flightroute.save();
    req.flash('success','Successfully booked a new flight!');
    res.redirect("/flightroutes/new");
})


module.exports = router;