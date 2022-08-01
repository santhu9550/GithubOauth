const express = require("express");
const weatherRoutes = require("./routes/weatherRoutes");
const passport = require("./Config/Auth");
const session = require("express-session");
const app = express();

app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: false })
);
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
const port = 5000;

app.get("/", (req, res) => {
  res.write("<a href='/login'>Sign With Github</a>");
  res.send();
});
app.get("/login", passport.authenticate("github", { scope: ["user:email"] }));

app.get(
  "/login/callback",
  passport.authenticate("github", { failureRedirect: "/fail" }),
  function (req, res) {
    // Successful authentication,
    res.redirect("/weather");
  }
);

app.get("/fail", (req, res) => res.send("Login Unsuccesfull"));

app.use("/weather", ensureAuthenticated, weatherRoutes);

app.get("/logout", function (req, res) {
  req.logout({ keepSessionInfo: false }, (err) => console.log(err));
  res.redirect("/");
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/fail");
}

app.listen(port, () => console.log("Server Running at " + port));
