const mongoose = require('mongoose');

const AIMetadataSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true, unique: true },
  summary: { type: String }, // Neutral summary
  tags: [{ type: String }], // e.g., "Major Accident", "Imported"
  lastGeneratedAt: { type: Date, default: Date.now },
  modelUsed: { type: String }, // e.g., "gemini-1.5-pro"
}, { timestamps: true });

module.exports = mongoose.model('AIMetadata', AIMetadataSchema);
