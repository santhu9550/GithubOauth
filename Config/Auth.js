var passport = require("passport");
const mysql = require("mysql");
const { Passport } = require("passport");
var GitHubStrategy = require("passport-github2").Strategy;

const connection = mysql.createConnection({
  host: "sql6.freemysqlhosting.net",
  user: "sql6509309",
  password: "x9I67tMsLa",
  database: "sql6509309",
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, user);
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.use(
  new GitHubStrategy(
    {
      clientID: "94521dd09808fc0114be",
      clientSecret: "3b240fcc1b47ea1fb921b5d3e6756266f833b49f",
      callbackURL: "http://localhost:5000/login/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      //   User.findOrCreate({ githubId: profile.id }, function (err, user) {
      //     return done(err, user);
      //   });

      connection.query(
        "SELECT * FROM Owners WHERE id = ?",
        [profile.id],
        function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            return done(error, results[0]);
          }
          if (results.length <= 0) {
            const newOwner = {
              id: profile.id,
              name: profile._json.name,
              image: profile._json.avatar_url,
              location: profile._json.location,
            };
            console.log(newOwner);
            connection.query(
              "INSERT INTO Owners SET ?",
              newOwner,
              function (error, createdRes, cretF) {
                if (error) throw error;
                return done(error, newOwner);
              }
            );
          }
        }
      );
    }
  )
);

module.exports = passport;
