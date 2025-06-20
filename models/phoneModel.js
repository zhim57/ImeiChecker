const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const phoneModelSchema = new Schema({
  // Device model identifier (e.g. "SM-G991U")
  model: { type: String, required: true, unique: true },
  // Human friendly name such as "Galaxy S21"
  modelName: String,
  deviceImage: String,
  netTech: String,
  speed: String,
  bands: {
    twoG: [String],
    wcdma: [String],
    lte: [String],
  },
  scores: {
    att4g: Number,
    tmobile4g: Number,
    verizon4g: Number,
  },
  compatibleModels: [String],
  // Optional user supplied note
  note: String,
});

const PhoneModel = mongoose.model("PhoneModel", phoneModelSchema);

module.exports = PhoneModel;

