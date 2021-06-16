const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FlightrouteSchema = new Schema({
    price: Number,
    origin: String,
    destination: String,
    date: String, 
    airline: String,
    direct: Boolean,
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Flightroute', FlightrouteSchema);