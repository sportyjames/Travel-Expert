const express = require('express');
const router = express.Router();
const flightroutes = require('../controllers/flightroutes');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isOwner, validateFlightroute} = require('../middleware'); //cannot book new flightroute if not signed in !!!

//flight index page
router.get('/', isLoggedIn ,catchAsync(flightroutes.index));

//flight new form page
router.get('/new', flightroutes.renderNewForm);

//flight show page
router.get('/:id', isLoggedIn, isOwner, catchAsync(flightroutes.showFlightroutes));

//flight edit form page 
router.get('/:id/edit',isLoggedIn, isOwner, catchAsync(flightroutes.renderEditForm));

//flight booking submission
router.post('/', isLoggedIn, catchAsync(flightroutes.createFlightroute));

//flight update submission: 
    //validateFlightroute is gonna validate our data before we even attempt to save it with Mongoose
router.put('/:id', isLoggedIn, isOwner, validateFlightroute, catchAsync(flightroutes.updateFlightroute))

//flight delete submission(need to add isOwner middleware)
router.delete('/:id', isLoggedIn, isOwner, catchAsync(flightroutes.destroyFlightroute))



module.exports = router;