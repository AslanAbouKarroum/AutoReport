const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['public', 'insurance', 'admin'], 
    default: 'public' 
  },
  // For Insurance Companies
  companyName: { type: String },
  isVerified: { type: Boolean, default: false }, // Admin verification
  licenseNumber: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
