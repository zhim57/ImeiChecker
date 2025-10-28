const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imeiCheckSchema = new Schema({
  // The IMEI number that was checked
  imei: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  // Reference to the phone model identifier (not ObjectId, just the model string)
  phoneModel: {
    type: String,
    required: true,
    index: true,
  },
  // Optional user identifier for future user tracking
  userId: {
    type: String,
    default: null,
  },
  // When this IMEI was first checked
  checkedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  // Source of the data: 'api' (external API) or 'cache' (from database)
  source: {
    type: String,
    enum: ['api', 'cache'],
    default: 'api',
  },
  // Number of times this IMEI has been checked
  checkCount: {
    type: Number,
    default: 1,
  },
  // Last time this IMEI was checked
  lastCheckedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for analytics queries
imeiCheckSchema.index({ phoneModel: 1, checkedAt: -1 });

const ImeiCheck = mongoose.model("ImeiCheck", imeiCheckSchema);

module.exports = ImeiCheck;
