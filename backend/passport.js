const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("./models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if email already exists
        let existingEmailUser = await User.findOne({ Email: profile.emails[0].value });
        if (existingEmailUser) {
			return done(null, false, { message: "Email already registered." });
        }

        // Check if Google ID already exists
        let user = await User.findOne({ googleId: profile.id });
  
        if (user) {
          // If user exists, return user
          done(null, user);
        } else {
          // If user doesn't exist, create a new user
          user = await new User({
            googleId: profile.id,
            Username: profile.displayName,
            Email: profile.emails[0].value,
            UserType: "patient"
          }).save();
          done(null, user);
        }
      } catch (err) {
        console.error(err);
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
