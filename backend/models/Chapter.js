const mongoose = require('mongoose');
const crypto = require('crypto');

const SubQRSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  qrContent: {
    type: String,
    required: true
  },
  qrUrl: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const ChapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  qrId: {
    type: String,
    unique: true,
    default: () => crypto.randomBytes(16).toString('hex')
  },
  qrContent: {
    type: String
  },
  qrUrl: {
    type: String
  },
  subQRs: [SubQRSchema],
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chapter', ChapterSchema);
