const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

//mongo sql injection prevention(prevent key with dollar sign and period)
const mongoSanitize = require('express-mongo-sanitize');


//require flight routes 
const flightrouteRoutes = require('./routes/flightroutes');
//require user routes
const userRoutes = require('./routes/users');
//require picture routes
const pictureRoutes = require('./routes/pictureroutes')
//require about routes
const aboutRoutes = require('./routes/AboutRoutes')
//require faq routes
const faqRoutes = require('./routes/FaqRoutes')

//db connection
mongoose.connect('mongodb://localhost:27017/travel-expert', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

// Set useFindandModify to be false
mongoose.set('useFindAndModify', false);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
//db connection finish

const app = express();

//tell express to use ejsNate
app.engine('ejs',ejsMate);

//ejs view folder setup
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'))

//middleware: tell express to serve static files under public folder on every single request
app.use(express.static('public'));
//middleware: tell express to parse the req.body on every single request
app.use(express.urlencoded({extended: true}));
//middleware: tell express to use method override(put,delete)
app.use(methodOverride('_method'));

//sql injection protection
app.use(mongoSanitize())


//session and flash
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false, //this makes deprecation warning go away
    saveUninitialized: true, //this makes deprecation warning go away
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //so user won't sign in forever
        maxAge: 1000 * 60 * 60 * 24 * 7 //cookie age
    }
}
app.use(session(sessionConfig));
app.use(flash());


//passport setup make sure it is defined after session and flash
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //tell passport to use the localstrategy
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//this middleware ensures flash won't be passed to template but have access to something called success
app.use((req, res, next) => {
    // console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error'); //work on it later
    next();
})

//routes
//0. userroutes
app.use('/', userRoutes);

//1. flightroutes
app.use('/flightroutes', flightrouteRoutes)
//2. picture routes
app.use('/picture', pictureRoutes)
//3. about routes
app.use('/about', aboutRoutes)
//4. faq routes
app.use('/faq', faqRoutes)

//2. home route
app.get('/', (req, res) => {
    res.render('home')
});


//404 error handler
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

//error middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})