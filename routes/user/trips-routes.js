const express = require("express");
const typeAuth = require("../../middleware/type-auth")
const isAuth = require("../../middleware/is-auth")
const { fetchAllTrips } = require("../../controllers/user/trips-controller");


const router = express.Router();

router.get("/get", fetchAllTrips);

module.exports = router;
