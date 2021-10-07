const express = require("express"); // importing express
const https = require("https"); // importing https
const app = express(); // creating express app
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// creating home route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const query = req.body.cityName;
  const units = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&units=" +
    units +
    "&appid=" +
    process.env.API_KEY;
  https.get(url, (response) => {
    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const desc = weatherData.weather[0].description;
      const icon =
        "http://openweathermap.org/img/wn/" +
        weatherData.weather[0].icon +
        "@2x.png";
      console.log(icon);
      res.write("<p>The Weather is currently " + desc + "</p>");

      res.write(
        "<h1>The temperature in " +
          query +
          " is " +
          temp +
          " degree Celcius. </h1>"
      );
      res.write("<img src=" + icon + " />");
      res.send();
    });
  });
});

// Starting server on port 3000
app.listen(3000, () => console.log("Starting server on port 3000"));
