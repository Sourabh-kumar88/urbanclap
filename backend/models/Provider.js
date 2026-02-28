const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  experience: {
    type: Number,
    default: 0
  },
  categories: [{
    type: String,
    trim: true
  }],
  availability: {
    type: String,
    default: 'available'
  },
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  serviceArea: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  hourlyRate: {
    type: Number,
    default: 0
  },
  profileImage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Provider', providerSchema);
