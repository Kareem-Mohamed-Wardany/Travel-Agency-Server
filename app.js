const express = require("express");
const axios = require("axios")
require("express-async-errors");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routes/auth/auth-routes");
const adminTripsRouter = require("./routes/admin/trips-routes");
const userTripsRouter = require("./routes/user/trips-routes");
const userReservationRouter = require("./routes/user/reservation-routes");

const typeAuth = require("./middleware/type-auth")
const isAuth = require("./middleware/is-auth")

const notFoundMiddleware = require("./middleware/not-found")
const errorHandlerMiddleware = require("./middleware/error-handler")


//create a database connection -> u can also
//create a separate file for this and then import/use that file here


const app = express();
const PORT = process.env.PORT || 5000;


app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(express.json());


// Authentication routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin/trips", isAuth, typeAuth('admin'), adminTripsRouter);
app.use("/api/v1/user/trips", userTripsRouter);
app.use("/api/v1/user/reservation", isAuth, typeAuth('user'), userReservationRouter);



// error handling middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("MongoDB connected")
    app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
  })
  .catch((error) => console.log(error));
