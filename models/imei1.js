const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// testing embedded schema

// const blacklistStatusSchema = new mongoose.Schema({
//   // _id: mongoose.Schema.Types.ObjectId,
//   // control: { type: mongoose.Schema.Types.ObjectId, ref: "Control" },
//   status: {
//     type: Boolean,
//     required: false
//   },
  
// });


// const requestsSchema = new mongoose.Schema({
 
//   deviceImei: {
//     type: Number,
//     trim: true,
//   },
//   blacklist: {},
//   brand: {
//     type: String,
//     trim: true,
//   },
//   controlNumber: {
//     type: String,
//     trim: true,
//   },
//   device_id: {
//     type: String,
//     trim: true,
//   },
//   deviceImage: {
//     type: String,
//     trim: true,
//   },
//   device_spec: {}
//   ,
//   deviceName: {
//     type: String,
//     trim: true,
//   },
//   deviceSerial: {
//     type: Number,
//     trim: true,
//   },

//   type: {
//     type: String,
//     trim: true,
//   },
//   deviceSpeed: [],
//   frequency: [],
//   models: [],

//   frequencyArray2g: [],
//   frequencyArrayLte: [],
//   frequencyArrayTdd: [],
//   frequencyArrayWcdma: [],

//   deviceTac: {
//     type: Number,
//     trim: true,
//   },
//   tmobileScore: {
//     type: Number,
//     trim: true,
//   },
//   verizonScore: {
//     type: Number,
//     trim: true,
//   },
//   attScore: {
//     type: Number,
//     trim: true,
//   },
//   overallScore: {
//     type: Number,
//     trim: true,
//   },


  
// });

// test code  end

const imei1Schema = new Schema({
  day: {
    type: Date,
    default: Date.now,
  },
  requests: {} ,
});

const Imei1 = mongoose.model("Imei1", imei1Schema);

module.exports = Imei1;