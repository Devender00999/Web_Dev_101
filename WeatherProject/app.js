const express = require("express"); // importing express
const https = require("https"); // importing https
const app = express(); // creating express app
app.use(express.json());

// creating home route
app.get("/", (req, res) => {
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=delhi&units=metric&appid=" +
    process.env.API_KEY;
  https.get(url, (response) => {
    console.log(response);
    res.send("Hello World!!");
  });
});

// Starting server on port 3000
app.listen(3000, () => console.log("Starting server on port 3000"));
