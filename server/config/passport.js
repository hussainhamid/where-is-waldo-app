const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

require("dotenv").config();
const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRETKEY;

passport.use(
  new jwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: jwt_payload.user.id,
        },
      });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      console.log("error in passport.js jwtStrategy", err);
      return done(err, false);
    }
  })
);
