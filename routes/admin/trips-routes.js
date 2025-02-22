const express = require("express");
const multer = require("multer");

const {
  addTrip,
  deleteTrip,
  editTrip,
  fetchAllTrips,
} = require("../../controllers/admin/trips-controller");


const router = express.Router();
const storage = multer.memoryStorage(); // Files will be stored in memory (buffer)
const upload = multer({ storage });

router.post("/add", upload.single("img"), addTrip);
router.put("/edit/:id", upload.single("img"), editTrip);
router.delete("/delete/:id", deleteTrip);
router.get("/get", fetchAllTrips);

module.exports = router;
