const {userSchema, flightrouteSchema, registerSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Flightroute = require('./models/flightroute');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
    const {id} = req.params;
    const flightroute = await Flightroute.findById(id);
    if(!flightroute.owner.equals(req.user._id))
    {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/flightroutes`);
    }
    next();
}

//middleware
module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400) 
    }
    else{
        next();
    }
}

module.exports.validateFlightroute = (req, res, next) => {
    const { error } = flightrouteSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400) 
    }
    else{
        next();
    }
}

module.exports.registerValidation = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400) 
    }
    else{
        next();
    }
}

