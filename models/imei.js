const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imeiSchema = new Schema({
  day: {
    type: Date,
    default: Date.now
  },
  exercises:[
    {
  type: {
    type: String,
    trim: true,
    required: "Enter a name for exercise"
  },
  name: {
    type: String,
    trim: true,
    required: "Enter a name for workout"
  },

  distance: {
    type: Number,
    trim: true,
    
  },
  duration: {
    type: Number,
    trim: true,
    required: "Enter the duration"
  },
  weight: {
    type: Number,
    
  },
  sets: {
    type: Number,
   
  },
  reps: {
    type: Number,
  
  }
}
  ]

});

 


const Imei = mongoose.model("Imei", imeiSchema);

module.exports = Imei;
