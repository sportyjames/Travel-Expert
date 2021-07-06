const express = require('express');
const router = express.Router();
const Flightroute = require('../models/flightroute');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, isOwner} = require('../middleware'); //cannot book new flightroute if not signed in !!!
const dfs = require('../helpers/dfs'); //dfs helper
const dfs_input = require('../helpers/dfs_input'); //create dfs input helper
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"); //import mbxGeocoding service 
const mapBoxToken = 'pk.eyJ1Ijoic3BvcnR5amFtZXMiLCJhIjoiY2twaHQxd3p6MDI0YjJwczFqYWd1MW83eSJ9.Ec5CD2tM6R-F812BnoCYvA';
const geocoder = mbxGeocoding({accessToken: mapBoxToken})


//new flight booking page
router.get('/new', (req, res) => {
    res.render('flightroutes/new');
})

//flight index page
router.get('/', isLoggedIn ,catchAsync(async(req, res) => {
    const flightroutes = await Flightroute.find( { owner: req.user._id } ); //only find routes belonging to this owner 

    const flightroutesCopy = await Flightroute.find( { owner: req.user._id }); //to use it in map API script 

    const departure = (await User.findById(req.user._id)).departure; //find the user's departure

    const unorder_itineraries = dfs_input(flightroutes);

    const order_itineraries = dfs(unorder_itineraries,departure);

    res.render('flightroutes/index', { flightroutes, flightroutesCopy, order_itineraries });
}));

//flight show page (need to add isOwner middleware)
router.get('/:id', isLoggedIn, isOwner, catchAsync(async(req, res) => {
    const flightroute = await Flightroute.findById(req.params.id);
    res.render('flightroutes/show', { flightroute });
}));

//flight edit page (need to add isOwner middleware)
router.get('/:id/edit',isLoggedIn, isOwner, catchAsync(async (req, res) => {
    const flightroute = await Flightroute.findById(req.params.id);
    res.render('flightroutes/edit', { flightroute });
}))

//flight booking submission
router.post('/', isLoggedIn, catchAsync(async (req,res) => {
   //create the geoData for origin
    const oriGeoData = await geocoder.forwardGeocode({
        query: req.body.flightroute.origin,
        limit: 1
    }).send()

    //create the geoData for destination
    const desGeoData = await geocoder.forwardGeocode({
        query: req.body.flightroute.destination,
        limit: 1
    }).send()

     //try to create one and store in db 
    const flightroute = new Flightroute(req.body.flightroute);
    flightroute.oriGeometry = oriGeoData.body.features[0].geometry;
    flightroute.desGeometry = desGeoData.body.features[0].geometry;
    flightroute.owner = req.user._id;
    await flightroute.save();
    console.log(flightroute);
    req.flash('success','Successfully booked a new flight!');
    res.redirect("/flightroutes/new");
}))


//flight edit submission(need to add isOwner middleware)
router.put('/:id', isLoggedIn, isOwner, catchAsync(async (req, res) => {
    if(!req.body.flightroute.date) throw new ExpressError('Invalid time', 400); //server client validation for invalid time input
    const { id } = req.params;
    const flightroute = await Flightroute.findByIdAndUpdate(id, {date: req.body.flightroute.date});
    req.flash('success', 'Successfully updated flight!');
    res.redirect(`/flightroutes/${flightroute._id}`)
}))

//flight delete submission(need to add isOwner middleware)
router.delete('/:id', isLoggedIn, isOwner, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Flightroute.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted flight')
    res.redirect('/flightroutes');
}))



module.exports = router;