const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, "Please provide image"],
    },
    public_id: {
        type: String,
    },
    Name: {
        type: String,
        required: [true, 'Please provide Trip Name'],
        minlength: [5, "Trip Name must be at least 5 characters"],
    },
    description: {
        type: String,
        required: [true, 'Please provide Description'],
        minlength: [5, "Description must be at least 5 characters"],
    },
    location: {
        type: String,
        required: [true, 'Please provide Location'],
        maxlength: [20, "Location can be at most 20 characters"],
        minlength: [3, "Location must be at least 3 characters"],
    },
    price: {
        type: Number,
        required: [true, 'Please provide Price'],
        min: 1
    },
    departureDate: {
        type: String,
        required: [true, 'Please provide Departure Date'],
    },
    duration: {
        type: String,
        required: [true, 'Please provide Duration'],
    },
    availableSeats: {
        type: Number,
        required: [true, 'Please provide Available Seats'],
        min: 0
    },
    transportation: {
        type: String,
        required: [true, 'Please provide Transportation'],
        maxlength: [100, "Transportation can be at most 100 characters"],
        minlength: [3, "Transportation must be at least 3 characters"],
    },
    extra: {
        type: String,
    },
    reservations: {
        type: Number,
        default: 0,
    },
    reservedBy: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // Reference to User model
                required: true
            },
            reservedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

module.exports = mongoose.model("Trip", TripSchema);
