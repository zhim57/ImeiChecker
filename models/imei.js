
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imeiSchema = new Schema({
  day: {
    type: Date,
    default: Date.now
  },
  requests:[
    {

  country: {
    type: String,
    trim: true,
    required: "Enter country"
  },
  type: {
    type: String,
    trim: true,
    required: "Enter Imei"
  },
  value: {
    type: String,
    trim: true,
    required: "Enter a response object"
  },
  username: {
    type: String,
    trim: true,
    required: "Enter a response object"
  },
  response: {
    type: String,
    trim: true,
    // required: "Enter a response object"
  }

 
}
  ]

});

 


const Imei = mongoose.model("Imei", imeiSchema);

module.exports = Imei;
