const { handleImageUpload, deleteImage } = require("../../helpers/cloudinary");
const Trips = require("../../models/Trips");
const ApiResponse = require("../../custom-response/ApiResponse");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../../errors')

// Add a new Trip
const addTrip = async (req, res) => {
  const { Name, description, location, price, departureDate, duration, availableSeats, transportation } = req.body;

  // Validate required fields
  if (!Name || !description || !location || !price || !departureDate || !duration || !availableSeats || !transportation) {
    throw new BadRequestError('Missing required data');
  }

  // Upload image to Cloudinary
  const { image, public_id } = await handleImageUpload(req);
  if (!image) {
    throw new BadRequestError('Failed to upload image');
  }

  // Assign image URL and public ID to product data
  req.body.image = image;
  req.body.public_id = public_id;

  // Create the Trips in database
  await Trips.create({ ...req.body });

  const response = new ApiResponse({
    statusCode: StatusCodes.CREATED,
    success: true,
    msg: "Trip added successfully",
    data: null,
  });

  res.status(response.statusCode).json(response);
};

// Fetch all trips with pagination
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
    .populate("reservedBy.userId", "fullName")
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
    success: true,
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

// Edit a Trip
const editTrip = async (req, res) => {
  const { _id, Name, description, location, price, departureDate, duration, availableSeats, transportation, extra } = req.body;

  let findTrip = await Trips.findById(_id);

  if (!findTrip) throw new NotFoundError("Trip cannot be found");

  // If image is updated, delete old image from Cloudinary and upload new one
  if (req.file) {
    const result = await deleteImage(findTrip.public_id);
    if (result.result === 'ok') {
      const uploadedResult = await handleImageUpload(req);
      if (!uploadedResult.url) {
        throw new BadRequestError('Failed to upload image');
      }
      findTrip.image = uploadedResult.url;
    }
  }

  // Update Trip fields
  findTrip.Name = Name || findTrip.Name;
  findTrip.description = description || findTrip.description;
  findTrip.location = location || findTrip.location;
  findTrip.price = price || findTrip.price;
  findTrip.departureDate = departureDate || findTrip.departureDate;
  findTrip.duration = duration || findTrip.duration;
  findTrip.availableSeats = availableSeats || findTrip.availableSeats;
  findTrip.transportation = transportation || findTrip.transportation;
  findTrip.extra = extra || findTrip.extra;


  await findTrip.save();

  const response = new ApiResponse({
    statusCode: StatusCodes.OK,
    success: true,
    msg: "Trip edited successfully",
    data: findTrip,
  });

  res.status(response.statusCode).json(response);
};

// Delete a trip
const deleteTrip = async (req, res) => {
  const { id } = req.params;
  let findTrip = await Trips.findById(id);

  if (!findTrip) throw new NotFoundError("Trip cannot be found");

  // Delete image from Cloudinary and the Trip from DB
  const result = await deleteImage(findTrip.public_id);
  if (result.result === 'ok') {
    await Trips.deleteOne({ _id: id });
  } else {
    throw new BadRequestError('Failed to delete image');
  }

  const response = new ApiResponse({
    statusCode: StatusCodes.OK,
    success: true,
    msg: "Trip deleted successfully",
    data: null,
  });

  res.status(response.statusCode).json(response);
};

module.exports = {
  addTrip,
  deleteTrip,
  editTrip,
  fetchAllTrips,
};
