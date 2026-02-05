const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  vin: { type: String, unique: true, sparse: true, uppercase: true }, // Vehicle Identification Number
  plateNumber: { type: String, unique: true, sparse: true, uppercase: true }, // Lebanese Plate
  make: { type: String },
  model: { type: String },
  year: { type: Number },
  color: { type: String },
  
  // Derived / Cached Data
  lastEventDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);
