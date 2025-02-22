const express = require("express");
const { bookTrip, cancelReservation, AllReservations } = require("../../controllers/user/reservation-controller");


const router = express.Router();

router.get("/book/:id", bookTrip);
router.get("/cancel/:id", cancelReservation);
router.get("/reserved-trips", AllReservations);

module.exports = router;
