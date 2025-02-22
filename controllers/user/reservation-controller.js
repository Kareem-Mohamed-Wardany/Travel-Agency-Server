const Trips = require("../../models/Trips");
const ApiResponse = require("../../custom-response/ApiResponse");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../../errors')

const bookTrip = async (req, res) => {
    const tripId = req.params.id;
    const userId = req.user.userId;
    const trip = await Trips.findById(tripId);
    if (!trip) throw new BadRequestError("Trip not found");
    if (trip.availableSeats === trip.reservations) throw new BadRequestError("Trip is fully booked!");

    // Check if the user has already reserved the trip
    const alreadyReserved = trip.reservedBy.some(reservation => reservation.userId.toString() === userId);
    if (alreadyReserved) throw new BadRequestError("Trip already reserved!");

    // Add user to reservations
    trip.reservedBy.push({ userId });
    trip.reservations += 1;

    await trip.save();
    const response = new ApiResponse(
        {
            statusCode: StatusCodes.OK,
            success: true,
            msg: "Trip booked successfully",
            data: null
        })
    res.status(response.statusCode).json(response);
}

const cancelReservation = async (req, res) => {
    const tripId = req.params.id;
    const userId = req.user.userId;
    const trip = await Trips.findById(tripId);
    if (!trip) throw new BadRequestError("Trip not found");

    const reservationIndex = trip.reservedBy.findIndex(reservation => reservation.userId.toString() === userId);
    if (reservationIndex === -1) throw new BadRequestError("You have not reserved this trip");

    // Remove the user from the reservations array
    trip.reservedBy.splice(reservationIndex, 1);
    trip.reservations -= 1;

    await trip.save();
    const response = new ApiResponse(
        {
            statusCode: StatusCodes.OK,
            success: true,
            msg: "Trip reservation canceled successfully",
            data: null
        })
    res.status(response.statusCode).json(response);
}
const AllReservations = async (req, res) => {
    try {
        const userId = req.user.userId;
        let { page = 1, limit = 10 } = req.query;

        page = parseInt(page) || 1; // Default page = 1
        limit = parseInt(limit) || 10; // Default limit = 10

        const skip = (page - 1) * limit;

        // Find trips where the user has a reservation
        const reservedTrips = await Trips.find({ "reservedBy.userId": userId })
            .populate("reservedBy.userId", "fullName") // Populate user details
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const totalTrips = await Trips.countDocuments({ "reservedBy.userId": userId });

        if (!reservedTrips.length) {
            throw new BadRequestError("No Trips found");
        }

        const response = new ApiResponse(
            {
                statusCode: StatusCodes.OK,
                success: true,
                msg: "Trip retrieved successfully",
                data: {
                    reservedTrips,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(totalTrips / limit),
                        totalTrips,
                    },
                },
            })
        res.status(response.statusCode).json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error. Please try again later." });
    }
}




module.exports = { bookTrip, cancelReservation, AllReservations };
