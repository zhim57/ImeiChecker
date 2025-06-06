const mongoose = require("mongoose");

const Schema = mongoose.Schema;



const imei1Schema = new Schema({
  day: {
    type: Date,
    default: Date.now,
  },
  requests: {} ,
});

const Imei1 = mongoose.model("Imei1", imei1Schema);

module.exports = Imei1;