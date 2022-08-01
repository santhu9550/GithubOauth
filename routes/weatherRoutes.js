const express = require("express");
const axios = require("axios").default;

const router = express.Router();

// // middleware that is specific to this router
// router.use((req, res, next) => {
//   console.log('Time: ', Date.now())
//   next()
// })

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

router.post("/", (req, res) => {
  const q = req.body.city;
  console.log(q);
  const url =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    q +
    "&appid=89505772d2f9a1b5f498d49205405275";
  axios
    .get(url)
    .then(function (response) {
      const status = response.status;
      const data = response.data;
      if (status == 200) {
        const main = data.weather[0].main;
        const descr = data.weather[0].description;
        const icon = data.weather[0].icon;
        const city = data.name;
        const temp = data.main.temp;

        res.write("<h1>AT " + city + "   " + main + "</h1>");
        res.write("<h4> The weather is currently " + descr + "</h4>");
        res.write("<h4> The Temp is  " + temp + "</h4>");
        res.write(
          "<img src='http://openweathermap.org/img/wn/" + icon + "@2x.png'/>"
        );

        res.write("<a href='/weather'> GO Back</a>");
        res.write("<br/><a href='/logout'> Logout</a>");
        res.send();
      } else {
        res.send("Internal Server Error");
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
});

module.exports = router;
