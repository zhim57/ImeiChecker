const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const phoneModelSchema = new Schema({
  // Device model identifier (e.g. "SM-G991U")
  model: { type: String, required: true, unique: true, index: true },
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
  // Track which bands were manually updated by users
  manuallyUpdated: {
    twoG: { type: Boolean, default: false },
    wcdma: { type: Boolean, default: false },
    lte: { type: Boolean, default: false },
  },
  // When this model was last updated
  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  // Who last updated this model (username, email, or user ID)
  lastUpdatedBy: {
    type: String,
    default: 'system',
  },
  scores: {
    att4g: Number,
    tmobile4g: Number,
    verizon4g: Number,
  },
  compatibleModels: [String],
  // How many times this model has been queried
  checkCount: {
    type: Number,
    default: 0,
    index: true,
  },
  // Data completeness percentage (0-100)
  dataCompleteness: {
    type: Number,
    default: 0,
    index: true,
  },
  // Optional user supplied note
  note: String,
});

const PhoneModel = mongoose.model("PhoneModel", phoneModelSchema);

module.exports = PhoneModel;

