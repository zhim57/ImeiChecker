const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const phoneModelSchema = new Schema({
  model: { type: String, required: true, unique: true },
  bands: { type: Schema.Types.Mixed, default: {} },
  compatibleModels: [String]
});

const PhoneModel = mongoose.model("PhoneModel", phoneModelSchema);

module.exports = PhoneModel;

