let mongoose = require("mongoose");
let db = require("../models");

mongoose.connect("mongodb://localhost/imei", {
  useNewUrlParser: true,
  useFindAndModify: false
});

let imeiSeed = [
  {
    day: new Date().setDate(new Date().getDate()-10),
    requests: [
      {
        country: "Bulgaria",
        type: "Bicep",
        value: 12345678910,
        username: "zoro",
        response: "{thebestguyin the world1234}"
        
      }
    ]
  },

];

db.Imei.deleteMany({})
  .then(() => db.Imei.collection.insertMany(imeiSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
