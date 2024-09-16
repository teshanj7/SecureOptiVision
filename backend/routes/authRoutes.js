const express = require('express');
const router = express.Router();
const passport = require("passport");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

// Register a User
router.post("/add", registerUser);

// Login user
router.post("/login", loginUser);

// Handle login success
router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "Successfully Logged In",
            user: req.user,
        });
    } else {
        res.status(403).json({ error: true, message: "Not Authorized" });
    }
});

// Handle login failure
router.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Log in failure",
    });
    res.redirect(`${process.env.CLIENT_URL}?success=false`);
});

// Google login route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback
router.get(
	"/google/callback",
	passport.authenticate("google", {
	  failureRedirect: `${process.env.CLIENT_URL_FAIL}?success=false&message=Sign in failure`,
	}),
	(req, res) => {
	  res.redirect(`${process.env.CLIENT_URL}?success=true`);
	}
  );
  

// Logout route
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: true, message: "Logout failed" });
        }
        res.redirect(`${process.env.CLIENT_URL}?logout=true`);
    });
});

module.exports = router;
