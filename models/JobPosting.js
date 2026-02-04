const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    enum: ['OLDTOWN', 'BIG VILNIUS', 'Both Locations']
  },
  address: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    required: true,
    enum: ['full-time', 'part-time', 'contract']
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String
  }],
  benefits: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('JobPosting', jobPostingSchema);
