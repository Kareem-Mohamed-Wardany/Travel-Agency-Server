const Trips = require("../../models/Trips");
const ApiResponse = require("../../custom-response/ApiResponse");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../../errors')


const fetchAllTrips = async (req, res) => {
    const { page = 1, limit = 3 } = req.query;
    const pageNumber = Number(page);
    const pageSize = Number(limit);

    // Validate page and limit values
    if (pageNumber < 1 || pageSize < 1) {
        throw new BadRequestError("Invalid page or limit");
    }

    // Fetch Trips with pagination
    const trips = await Trips.find()
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .exec();

    // Get total number of Trips for pagination info
    const totalTrips = await Trips.countDocuments().exec();

    if (!trips || trips.length === 0) {
        throw new BadRequestError("No Trips found");
    }

    // Send paginated response
    const response = new ApiResponse({
        msg: "Trips fetched successfully",
        data: {
            trips,
            pagination: {
                currentPage: pageNumber,
                totalPages: Math.ceil(totalTrips / pageSize),
                totalTrips,
            },
        },
        statusCode: StatusCodes.OK,
    });

    res.status(response.statusCode).json(response);
};



module.exports = { fetchAllTrips };

