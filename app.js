const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});

app.post("/", function(req,res){
  const query=req.body.cityName;
  const apikey = process.env.API_KEY;
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apikey+"&units="+unit;

  https.get(url, function(response){
    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      const desc = weatherData.weather[0].description;
      const temp = weatherData.main.temp;
      const icon = weatherData.weather[0].icon;

      res.render('result', {
        description: desc,
        city: query,
        temperature: temp,
        icon: icon
      });
    });
  })
});

app.listen(process.env.PORT||3000,function()
{
  console.log("server is running");
})
