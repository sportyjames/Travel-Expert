const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Flightroute = require('./models/flightroute');

//db connection
mongoose.connect('mongodb://localhost:27017/travel-expert', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

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

//routes
app.get('/', (req, res) => {
    res.render('home')
});

app.get('/flightroutes/new', (req, res) => {
    res.render('flightroutes/new');
})

app.post('/flightroutes', async (req,res) => {
    //try to create one and store in db 
    const flightroute = new Flightroute(req.body.flightroute);
    await flightroute.save();
    res.redirect("/");
})


app.listen(3000, () => {
    console.log('Serving on port 3000')
})