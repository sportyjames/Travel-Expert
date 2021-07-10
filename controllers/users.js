const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async(req, res) => {
    const { email, username, password, departure } = req.body;
    const user = new User({ email, departure, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success', `Welcome to Travel Expert, ${req.user.username}!`);
        res.redirect('/flightroutes/new');
    })
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success',`Welcome back ${req.user.username}!`);
    const redirectUrl = req.session.returnTo || '/flightroutes';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success',"Goodbye!");
    res.redirect('/');
}

module.exports.renderSetting = async(req, res) => {
    const departure = (await User.findById(req.user._id)).departure;
    const email = (await User.findById(req.user._id)).email;
    var name = (await User.findById(req.user._id)).name;
    if(!name){
        name = "New Passenger";
    }
    res.render('users/setting', {departure, email, name});
}

module.exports.setting = async(req, res) => {
    const currentUser = await User.findById(req.user._id);
    const {email, UserName, DepText } = req.body.user;
    await User.findByIdAndUpdate(currentUser, {email: email});
    await User.findByIdAndUpdate(currentUser, {departure: DepText});
    await User.findByIdAndUpdate(currentUser, {name: UserName});
    req.flash('success', 'Successfully updated your Profile info!');
    res.redirect("/flightroutes");
}