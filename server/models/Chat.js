const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  query: { type: String, required: true },
  responses: [{ agent: String, content: String }],
  final: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
