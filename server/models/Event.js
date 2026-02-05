const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user who submitted it
  
  // Core Event Data
  eventType: { 
    type: String, 
    required: true,
    enum: ['accident', 'claim', 'theft', 'import', 'total_loss', 'registration_transfer', 'inspection']
  },
  description: { type: String, required: true }, // ORIGINAL TEXT - IMMUTABLE
  dateOccurred: { type: Date, required: true },
  
  // Metadata
  images: [{ type: String }], // URLs to images if any (MVP: just strings)
  
  // Disclaimer / Legal
  isVerifiedByAdmin: { type: Boolean, default: false }, // Optional admin spot check
  
}, { 
  timestamps: true,
  immutable: true // Mongoose level immutability check
});

// Middlewares to strictly prevent updates
EventSchema.pre('findOneAndUpdate', function(next) {
  next(new Error('Events are append-only. Updates are not allowed.'));
});

EventSchema.pre('updateOne', function(next) {
  next(new Error('Events are append-only. Updates are not allowed.'));
});

module.exports = mongoose.model('Event', EventSchema);
