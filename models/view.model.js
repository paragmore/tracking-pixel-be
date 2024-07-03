const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema({
  githubUsername: { type: String, required: true },
  ip: { type: String, required: true },
  views: { type: Number, default: 1 },
  lastVisit: { type: Date, default: Date.now },
});

const View = mongoose.model('View', viewSchema);

module.exports = View
