const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  campaignName: String,
  rules: [
    {
      field: String,
      operator: String,
      value: Number
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Campaign', campaignSchema);
