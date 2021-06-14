const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FlightroutesSchema = new Schema({
    price: Number,
    origin: String,
    destination: String,
    date: Date, 
    airline: String,
    direct: Boolean
});

module.exports = mongoose.model('Flightroutes', FlightroutesSchema);