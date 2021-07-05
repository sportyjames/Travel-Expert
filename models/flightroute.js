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
    },
    oriGeometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    desGeometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
});

module.exports = mongoose.model('Flightroute', FlightrouteSchema);