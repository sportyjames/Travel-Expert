const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FlightrouteSchema = new Schema({
    price: Number,
    origin: String,
    destination: String,
    date: Date, 
    airline: String,
    direct: Boolean
});

module.exports = mongoose.model('Flightroute', FlightrouteSchema);