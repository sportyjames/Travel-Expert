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
