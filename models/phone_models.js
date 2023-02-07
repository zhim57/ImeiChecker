const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const modelSchema = new Schema({
  day: {
    type: Date,
    default: Date.now,
  },
  phone: [
    {
      Imei: {
        type: String,
        trim: true,
      },
      blacklist: {
        status: {
          type: String,
          trim: true,
        },
      },
      brand: {
        type: String,
        trim: true,
      },
      controlNumber: {
        type: String,
        trim: true,
      },
      device_id: {
        type: String,
        trim: true,
      },
      device_image: {
        type: String,
        trim: true,
      },
      device_spec: {
        type: String,
        trim: true,
      },
      name: {
        type: String,
        trim: true,
      },
      serial: {
        type: String,
        trim: true,
      },
      tac: {
        type: String,
        trim: true,
      },
      type: {
        type: String,
        trim: true,
      },
      speed: [],
      frequency: [],
      models: [],

      frequencyArrayLte: [],

      frequencyArrayWcdma: [],

      frequencyArrayTdd: [],

      frequencyArray2g: [],
    },
  ],
});

const Model = mongoose.model("Model", modelSchema);

module.exports = Model;
// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const imeiSchema = new Schema({
//   day: {
//     type: Date,
//     default: Date.now
//   },
//   exercises:[
//     {
//   type: {
//     type: String,
//     trim: true,
//     required: "Enter a name for exercise"
//   },
//   name: {
//     type: String,
//     trim: true,
//     required: "Enter a name for workout"
//   },

//   distance: {
//     type: Number,
//     trim: true,

//   },
//   duration: {
//     type: Number,
//     trim: true,
//     required: "Enter the duration"
//   },
//   weight: {
//     type: Number,

//   },
//   sets: {
//     type: Number,

//   },
//   reps: {
//     type: Number,

//   }
// }
//   ]

// });

// const Imei = mongoose.model("Imei", imeiSchema);

// module.exports = Imei;
