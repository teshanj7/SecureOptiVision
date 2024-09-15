const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
require("dotenv").config();
const path = require("path");
const authenticate = require("./middleware/authMiddleware.js");
const passport = require("passport");
//const cookieSession = require("cookie-session");
const session = require('express-session');
const passportStrategy = require("./passport");

// use helmet package for secure csp policy
const helmet = require("helmet");

// use helmet package for enable various security policy
app.use(helmet());

// use a csp policy for this express app
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    }
  })
)

app.use(express.json());
app.use(bodyParser.json());

// Configure cookie-session
// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["OptiVision"],
//     maxAge: 24 * 60 * 60 * 1000, // 24 hours
//   })
// );

// Configure session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set `true` for HTTPS
  })
);

// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// Prevent directory browsing and hide dotfiles
app.use(express.static('public', { dotfiles: 'ignore', index: false }));

//Defense against clickjacking attacks.
app.use(helmet.frameguard({ action: 'deny' }));

// Define routes
const authRoute = require("./routes/authRoutes");
app.use("/auth", authRoute);
const userRouter = require("./routes/user.js");
app.use("/user", authenticate, userRouter);
const appointmentRouter = require("./routes/appointments.js");
app.use("/appointment", appointmentRouter);
const paymentRouter = require("./routes/payments.js");
app.use("/payment", paymentRouter);
const cataract = require("./routes/cataractApplication.js");
app.use("/CataractApplication", cataract);
const glaucoma = require("./models/glaucoma.js");
app.use("/Glaucoma", glaucoma);
const meditationPrescriptionRouter = require('./routes/MeditationPrescription');
app.use("/meditationPrescription", meditationPrescriptionRouter);

// Database connection
const URL = process.env.MONGODB_URL;
const port = process.env.PORT || 8040;
mongoose.connect(URL).then(() => {
    app.listen(port, () => {
        console.log(`server is up and running on port number ${port}`)
    })
}).catch((error) => {
    console.log(error)
})
